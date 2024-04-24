export function extractRepoInfo(gitUrl: string): {
    owner: string;
    repoName: string;
} {
    const trimmedUrl = gitUrl.replace("https://github.com/", "");

    const repoInfo = trimmedUrl.endsWith(".git")
        ? trimmedUrl.slice(0, -4)
        : trimmedUrl;

    const [owner, repoName] = repoInfo.split("/");

    return { owner, repoName };
}
