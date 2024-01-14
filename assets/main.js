const defaultTheme = {
    "accentColor": "#97C193",
    "backgroundColor": "#102116",
    "mainColor": "#E3D8CD"
}
const greetingDate = document.getElementById("greeting-date-container")
const appsContainer = document.getElementById("apps-container")
const bookmarksContainer = document.getElementById("bookmarks-container")

async function loadJson(path) {
    try {
        return await (await fetch(path)).json()
    } catch (e) {
        console.log(`could not load ${path}, due to ${e}`)
        return undefined
    }

}

async function loadTheme() {
    let theme = await loadJson("./data/theme.json")
    if (theme === undefined) {
        console.log("using default theme")
        theme = defaultTheme
    }

    document.body.style.backgroundColor = theme.backgroundColor
    document.getElementById("greeting-text").style.color = theme.mainColor

    return theme
}

async function loadDate(theme) {
    greetingDate.style.color = theme.accentColor
    const hirji = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric'
    }).format(Date.now());
    const gregorian = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric'
    }).format(Date.now());
    greetingDate.innerHTML = `<h3 class="greeting-date">${gregorian}</h3>` + `<h3 class="greeting-date">${hirji}</h3>`
}

function generateAppItem(app, theme) {
    return `<li class="item">
                <a href="${app.url}" class="item-container" rel="noopener noreferrer" style="color:${theme.mainColor}">
                    <div class="item-icon-container">
                        <i class="item-icon" style="color:${theme.mainColor}">${app.icon}</i>
                    </div>
                    <div class="item-details">
                        <div class="item-name">${app.name}</div>
                        <p class="item-description" style="color:${theme.accentColor}">${app.displayURL}</p>
                    </div>
                </a>
            </li>`;
}

function generateAppSubHeading(name, theme) {
    return `<h3 class="sub-heading category-sub-heading" style="color:${theme.mainColor}">${name}</h3>`;
}

function generateBookmarkGroup(group, theme) {
    let html = `<li class="item">
        <div class="bookmark-container">
            <h3 class="sub-heading" style="color:${theme.mainColor}">${group.name}</h3>`

    for (const bookmark of group.items) {
        html += `<a href="${bookmark.url}" class="bookmark-link" rel="noopener noreferrer" style="color:${theme.accentColor}">${bookmark.name}</a>`
    }
    html += '</div>'
    html += '</li>'
    return html;
}

async function loadApps(theme) {
    const apps = await loadJson("./data/apps.json")
    if (apps === undefined) {
        return
    }

    let html = '<div class="category-container">'

    if (apps.apps !== undefined && apps.apps.length > 0) {
        html += generateAppSubHeading("Services", theme)
        html += `<ul class="items-list">`
        for (const app of apps.apps) {
            html += generateAppItem(app, theme)
        }
        html += '</ul>'
    }

    if (apps.categories !== undefined) {
        for (const category of apps.categories) {
            if (category.items.length === 0) {
                continue
            }
            html += generateAppSubHeading(category.name, theme)
            html += `<ul class="items-list">`
            for (const app of category.items) {
                html += generateAppItem(app, theme)
            }
            html += "</ul>"
        }
    }

    html += '</div>'
    appsContainer.innerHTML = html
}


async function loadBookmarks(theme) {
    const bookmarks = await loadJson("./data/bookmarks.json")
    if (bookmarks === undefined || bookmarks.groups === undefined || bookmarks.groups.length === 0) {
        return
    }

    let html = `<h2 class="category-heading" style="color:${theme.mainColor}">Bookmarks</h2>`
    html += '<ul class="items-list">'
    for (const group of bookmarks.groups) {
        html += generateBookmarkGroup(group, theme)
    }
    html += '</ul>'

    bookmarksContainer.innerHTML = html
}

window.onload = async function () {
    const theme = await loadTheme()
    await loadDate(theme)
    await loadApps(theme)
    await loadBookmarks(theme)
}