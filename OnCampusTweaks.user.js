// ==UserScript==
// @name         OnCampusTweaks
// @namespace    https://github.com/zsarge
// @version      1.0
// @description  Change the way Elder High School's student website behaves.
// @author       Zack Sargent
// @match        https://elderhs.myschoolapp.com/app/student
// @grant        none
// ==/UserScript==
// THIS CODE IS RELEASED UNDER THE MIT LICENSE

// -------------------
// Focus view
// -------------------

// Runs when page is fully loaded
// The website is set up in a way that window.onload triggers before the page is fully loaded.
// Thus, we must check independently to see if the full page has loaded.
var checkExist = setInterval(function() {
    // if the string "assignment-center" is in the url
    if (window.location.href.indexOf("assignment-center") > -1) { // TODO: find better way of doing this
        if (document.readyState === 'ready' || document.readyState === 'complete') {
            changeToWeekView();
            hideCompletedTasks();
            clearInterval(checkExist);
        }
    }

}, 100); // check every 100ms

// Changes to week view
function changeToWeekView() {
    // if the string "assignment-center" is in the url
    if (window.location.href.indexOf("assignment-center") > -1) {
        document.getElementById("week-view").click();
        console.log("OnCampusTweaks: Changed to week view");
    }

};

// hides completed tasks automatically in the assignment center
function hideCompletedTasks() {
    if (window.location.href.indexOf("assignment-center") > -1) {
        document.getElementById("filter-status").click();

        // Create a list of all of the button elements that appear when you filter by status
        var buttonElements = document.getElementsByClassName("pull-left btn btn-xs btn-approve status-button active");
        buttonElements[3].click(); // Hides Completed tasks

        // We have to get the buttons again because clicking on them changes the class structure
        buttonElements = document.getElementsByClassName("pull-left btn btn-xs btn-approve status-button active");
        buttonElements[3].click(); // Hides Graded tasks

        document.getElementById("btn-filter-apply").click();

        submitToVerify();

        console.log("OnCampusTweaks: Hid completed tasks");
    }
}

// Sometimes the built in function does not work very well, so we have to try again.
function submitToVerify() {
    document.getElementById("filter-status").click();
    document.getElementById("btn-filter-apply").click();
}

// -------------------
// GPA Calculator
// -------------------

var checkGrades = setInterval(function() {
    // if the string "assignment-center" is in the url
    if (window.location.href.indexOf("progress") > -1) { // TODO: find better way of doing this
        if (document.readyState === 'ready' || document.readyState === 'complete') {
            let courseDiv = document.getElementById("courses")
            let gradesArray = courseDiv.innerText.match(/([0-9][0-9][0-9]|[0-9][0-9])\%/gi);
            showGradeAverage(gradesArray);
            showMinMax(gradesArray);
        }
    }
}, 500); // check every 500ms

function showGradeAverage(gradesArray) {
    if (gradesArray) {
        runOnce(() => {
            // Hide header, for aesthetic reasons
            getHeaderById("conduct").click()
        })

        let gpa = getGPA(gradesArray)
        getGPADiv().textContent = `GPA: ${ gpa }%\n`
    } else {
        getGPADiv().textContent = "No GPA detected";
    }
}

function showMinMax(gradesArray) {
    if (gradesArray) {
        for(var i = 0; i < gradesArray.length; i++) {
            gradesArray[i] = parseInt(gradesArray[i]);
        }
        let min = Math.min(...gradesArray)
        getGPADiv().textContent += `Lowest grade: ${ min }%\n`
        let max = Math.max(...gradesArray)
        getGPADiv().textContent += `Highest grade: ${ max }%\n`
    }
}

var hasRun = false;
function runOnce(func) {
    if (!hasRun) {
        func();
        hasRun = true;
    }
}

function getGPA(gradesArray) {
    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    // turn array of strings into array of ints
    for(var i = 0; i < gradesArray.length; i++) {
        gradesArray[i] = gradesArray[i].replace('\%', '');
        gradesArray[i] = parseInt(gradesArray[i]);
    }

    let gpa = average(gradesArray)
    return Math.round(gpa * 100) / 100
    // round to two decimal places
}

function getGPADiv() {
    // Re-purposes unused Performance Div
//     return document.getElementById("collapseempty")
//     return document.getElementsByClassName("bb-tile-header")[2]
//     return document.getElementsByClassName("col-md-12")[4]
    let div = document.createElement("div")
    div.id = "custom-grades"
    let performance = document.getElementById("performanceCollapse")
    performance.appendChild(div)
    return document.getElementById("custom-grades")
}

function getHeaderById(id) {
    return document.getElementById(id).firstChild.firstChild.childNodes[1]
}
