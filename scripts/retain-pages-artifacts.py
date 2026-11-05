"""Retain current/previous successful Pages packages and protect all active runs."""
import argparse
import json
import os
from urllib.request import Request, urlopen


def choose_deletions(artifacts, statuses, current_run, keep=2):
    pages = [a for a in artifacts if a['name'] == 'github-pages']
    current = [a for a in pages if a['workflow_run']['id'] == current_run]
    successful = sorted([a for a in pages if a['workflow_run']['id'] != current_run and statuses[a['workflow_run']['id']]['status'] == 'completed' and statuses[a['workflow_run']['id']]['conclusion'] == 'success'], key=lambda a: a['created_at'], reverse=True)
    protected = {a['id'] for a in current + successful[:max(0, keep - len(current))]}
    return [a['id'] for a in pages if a['id'] not in protected and statuses[a['workflow_run']['id']]['status'] == 'completed']


def api(path, method='GET'):
    request = Request(os.environ.get('GITHUB_API_URL', 'https://api.github.com') + path, method=method, headers={'Authorization': 'Bearer ' + os.environ['GITHUB_TOKEN'], 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'})
    with urlopen(request, timeout=30) as response:
        data = response.read()
        return json.loads(data) if data else None


def main(dry_run):
    repository = os.environ['GITHUB_REPOSITORY']
    current_run = int(os.environ['GITHUB_RUN_ID'])
    base = '/repos/' + repository
    artifacts = []
    page = 1
    while True:
        batch = api(base + f'/actions/artifacts?per_page=100&page={page}')['artifacts']
        artifacts.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    statuses = {}
    for artifact in artifacts:
        if artifact['name'] == 'github-pages':
            run_id = artifact['workflow_run']['id']
            if run_id not in statuses:
                statuses[run_id] = api(base + f'/actions/runs/{run_id}')
    selected = set(choose_deletions(artifacts, statuses, current_run))
    deleted = []
    for artifact in artifacts:
        if artifact['id'] not in selected:
            continue
        fresh = api(base + f"/actions/runs/{artifact['workflow_run']['id']}")
        if fresh['status'] != 'completed':
            continue
        if not dry_run:
            api(base + f"/actions/artifacts/{artifact['id']}", 'DELETE')
        deleted.append({'id': artifact['id'], 'bytes': artifact['size_in_bytes']})
    result = {'dry_run': dry_run, 'count': len(deleted), 'bytes': sum(a['bytes'] for a in deleted), 'artifacts': deleted}
    print(json.dumps(result))
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as summary:
            summary.write(f"\nPages package retention: {'would remove' if dry_run else 'removed'} {result['count']} completed artifacts ({result['bytes']} bytes). Current, previous successful and active runs protected.\n")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dry-run', action='store_true')
    main(parser.parse_args().dry_run)
