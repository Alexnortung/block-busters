import { Octokit } from "octokit"

// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
//
// if (!GITHUB_TOKEN) {
//     console.error("GITHUB_TOKEN is not set")
//     process.exit(1)
// }

export const repositoryDispatchWhitelistAdd = async (username: string, id: string) => {
    // const octokit = new Octokit({
    //     auth: GITHUB_TOKEN,
    // });
    //
    // await octokit.rest.repos.createDispatchEvent({
    //     owner: "Alexnortung",
    //     repo: "my-nixos-systems",
    //     event_type: "minecraft_whitelist_add",
    //     client_payload: {
    //         username,
    //         id,
    //     },
    // });
}
