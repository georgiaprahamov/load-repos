function FuncRepos() {
    $('#repos').empty();
    let url = "https://api.github.com/users/" + $("#username").val() + "/repos";

    return $.ajax({
        url: url,
        success: function (repos) {
            displayRepos(repos);
            getUserInfo();
        },
        error: displayError
    });
}

function displayRepos(repos) {
    repos.sort(function (a, b) {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    for (let repo of repos) {
        let link = $('<a>').text(repo.full_name).attr('href', repo.html_url).attr('target', '_blank');
        let description = $('<p>').text(repo.description || 'No description available.');
        let stars = $('<span>').text('Stars: ' + repo.stargazers_count);
        let forks = $('<span>').text('Forks: ' + repo.forks_count);
        let watchers = $('<span>').text('Watchers: ' + repo.watchers_count);
        let lastUpdated = $('<span>').text('Last updated: ' + new Date(repo.updated_at).toLocaleDateString());
        let language = $('<span>').text('Language: ' + (repo.language || 'N/A'));
        let license = $('<span>').text('License: ' + (repo.license && repo.license.name || 'N/A'));

        let repoInfo = $('<div>').addClass('repo-info').append(description).append('<br>').append(stars).append(' | ').append(forks).append(' | ').append(watchers).append(' | ').append(lastUpdated).append(' | ').append(language).append(' | ').append(license);

        $('#repos').append($('<li>').append(link).append(repoInfo).addClass('repo-item'));
    }
}

function displayError(err) {
    $('#repos').append($('<li>').text('Error: There is no such repository in the Github system!'));
}

function saveToJson() {
    const username = document.getElementById("username").value;
    const repos = document.getElementById("repos").innerText.split("\n").filter(repo => repo.trim() !== "");
    const format = document.getElementById("format").value;

    let data;
    let filename;
    let mimetype;

    if (format === "json") {
        data = JSON.stringify({ "username": username, "repos": repos });
        filename = `${username}.json`;
        mimetype = "application/json";
    } else if (format === "csv") {
        data = "Repository\n" + repos.join("\n");
        filename = `${username}.csv`;
        mimetype = "text/csv";
    }

    const blob = new Blob([data], { type: mimetype });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;

    if (confirm("Are you sure you want to save the file?")) {
        link.click();
        URL.revokeObjectURL(url);
        alert(`${filename} saved successfully!`);
    }
}


let displayedUsers = {};

function displayUserInfo(user) {
    let userDiv = $('<div>').addClass('user-info');
    let avatar = $('<img>').attr('src', user.avatar_url).addClass('avatar');
    let name = $('<h2>').text(user.name);
    let login = $('<h3>').text(user.login);
    let bio = $('<p>').text(user.bio);
    let followers = $('<p>').text('Followers: ' + user.followers);
    let following = $('<p>').text('Following: ' + user.following);
    let publicRepos = $('<p>').text('Public Repos: ' + user.public_repos);
    let location = $('<p>').text('Location: ' + user.location);
    let email = $('<p>').text('Email: ' + (user.email ? user.email : 'User has no email'));
    let createdAt = $('<p>').text('Created at: ' + user.created_at);

    let button = $('<button>')
        .text('View Profile')
        .on('click', function () {
            window.open(user.html_url);
        });

    userDiv.append(avatar, name, bio, followers, following, publicRepos, email, location, createdAt, button);
    $('#repos').append($('<li>').append(login, userDiv));

    displayedUsers[user.login] = true;
}



function getUserInfo() {
    let username = $("#username").val();
    let url = `https://api.github.com/users/${username}`;
    return $.ajax({
        url: url,
        success: displayUserInfo,
        error: displayError
    });
}
