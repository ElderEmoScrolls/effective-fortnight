fetch("findings.json")
.then(response => response.json())
.then(data => {

const findings = data.findings

const severityCount = {
Critical:0,
High:0,
Medium:0,
Low:0,
Info:0
}

const timeline = {}

findings.forEach(f => {

if(severityCount[f.severity] !== undefined){
severityCount[f.severity]++
}

if(!timeline[f.date]){
timeline[f.date]=0
}

timeline[f.date]++

})

createSeverityChart(severityCount)
createTimelineChart(timeline)
populateTable(findings)

})

function createSeverityChart(data){

new Chart(
document.getElementById("severityChart"),
{
type:"bar",
data:{
labels:Object.keys(data),
datasets:[{
label:"Findings",
data:Object.values(data)
}]
}
}
)

}

function createTimelineChart(data){

new Chart(
document.getElementById("timelineChart"),
{
type:"line",
data:{
labels:Object.keys(data),
datasets:[{
label:"Findings Discovered",
data:Object.values(data)
}]
}
}
)

}

function populateTable(findings){

const table = document.querySelector("#findingsTable tbody")

findings.forEach(f => {

const row = document.createElement("tr")

row.innerHTML = `
<td>${f.severity}</td>
<td>${f.title}</td>
<td>${f.asset}</td>
<td>${f.date}</td>
`

table.appendChild(row)

})

}

document.getElementById("criticalCount").innerText = severityCount.Critical
document.getElementById("highCount").innerText = severityCount.High
document.getElementById("totalFindings").innerText = findings.length

const assets = new Set(findings.map(f=>f.asset))
document.getElementById("assetCount").innerText = assets.size
