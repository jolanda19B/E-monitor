function getNextWeekday() {
    let day = moment().tz("Europe/Berlin"); //today
    if (day.isoWeekday() >= 6) {
        day = day.add(1, "weeks").isoWeekday(1);
    }
    return day
}

function generateOutputDate(aDate) {
    const weekDays = ["None", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    return weekDays[aDate.isoWeekday()] + ", " + aDate.format('DD.MM.YYYY');
}

function selectIcon(notes) {
    const prefix = './icons/';
    const suffix = ".png";

    if (notes.includes("Vegan") || notes.includes("vegan")) {
        return prefix + "vegan" + suffix;
    } else if (notes.includes("Vegetarisch") || notes.includes("Vegetarian") || notes.includes("vegi")) {
        return prefix + "vegetarian" + suffix;
    } else if (notes.includes("Wild")) {
        return prefix + "deer" + suffix;
    } else if (notes.includes("Schweinefleisch") || notes.includes("Schwein")) {
        return prefix + "pig" + suffix;
    } else if (notes.includes("Rindfleisch") || notes.includes("Rind")) {
        return prefix + "cow" + suffix;
    } else if (notes.includes("Gefluegel") || notes.includes("Geflügel")) {
        return prefix + "chicken" + suffix;
    } else if (notes.includes("Fisch")) {
        return prefix + "fish" + suffix;
    } else {
        return prefix + "unknown" + suffix;
    }
}

function capString(input) {
    const MAX_LENGTH = 16
    if (input.length <= MAX_LENGTH) return input;
    const trimmed = input.slice(0, MAX_LENGTH);
    const lastSpaceIndex = trimmed.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
        return trimmed.slice(0, lastSpaceIndex);
    } else {
        return trimmed;
    }
}

function spawnEntry(dep) {
    const templateHTML = '<div class="panel" id="panel"><h2 class="name" id="name"></h2><p class="details" id="details"></p></div>';
    const element = $(templateHTML);

    if (dep["category"] !== undefined) {
        if (dep["category"] === "Info") {
            // Do not show information
            return
        }
        element.find("#name").text(capString(dep["category"]));
    }

    if (dep["name"] !== undefined) {
        element.find("#details").text(dep["name"]);
    }

    if (dep["notes"] !== undefined && dep["notes"].length > 0) {
        element.css("background-image", "url('" + selectIcon(dep["notes"]) + "')");
    }

    $('#entryContainer').append(element);
}

function clearTable() {
    $('#entryContainer').empty();
}

function populateTable(mensaId, baseUrl) {
    const nextWeekday = getNextWeekday();
    $("#date").text(generateOutputDate(nextWeekday));

    let targetUrl = baseUrl + nextWeekday.format("YYYY-MM-DD");
    if (baseUrl === undefined) {
        targetUrl = "https://openmensa.org/api/v2/canteens/" + mensaId + "/days/"  + nextWeekday.format("YYYY-MM-DD") +  "/meals";
    }

    $.getJSON(targetUrl, function (data) {
        clearTable();
        if (data.length > 0) {
            data.forEach(function (dep) {
                //DEBUG: console.log(dep);
                spawnEntry(dep);
            })
        }
    }).fail(function () {
        clearTable();
    });
}

$(document).ready(function () {
    if (window.mensaId === undefined && window.baseUrl === undefined) {
        console.error("Missing window.mensaId! Please specify this value before importing mensatv.js!");
    } else {
        populateTable(window.mensaId, window.baseUrl);
    }
});