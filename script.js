fetch("findings.json")
.then(response => {
if (!response.ok) {
throw new Error("Failed to load findings.json")
}
return response.json()
})
.then(data => {

const findings = data.findings || []

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
populateAssetTable(findings)
populateActivity(findings)
updateSummary(findings, severityCount)

})
.catch(error=>{
console.error("Dashboard data load error:", error)
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
},
options:{
responsive:true,
plugins:{legend:{display:false}}
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
data:Object.values(data),
tension:0.3
}]
},
options:{responsive:true}
}
)

}

function populateTable(findings){

const table = document.querySelector("#findingsTable tbody")
table.innerHTML=""

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

function updateSummary(findings,severityCount){

document.getElementById("criticalCount").innerText = severityCount.Critical
document.getElementById("highCount").innerText = severityCount.High
document.getElementById("totalFindings").innerText = findings.length

const assets = new Set(findings.map(f=>f.asset))
document.getElementById("assetCount").innerText = assets.size

}

function populateAssetTable(findings){

const assets={}

findings.forEach(f=>{

if(!assets[f.asset]){
assets[f.asset]={critical:0,high:0,total:0}
}

if(f.severity==="Critical") assets[f.asset].critical++
if(f.severity==="High") assets[f.asset].high++

assets[f.asset].total++

})

const table=document.querySelector("#assetTable tbody")
table.innerHTML=""

Object.entries(assets).forEach(([asset,data])=>{

const row=document.createElement("tr")

row.innerHTML=`
<td>${asset}</td>
<td>${data.critical}</td>
<td>${data.high}</td>
<td>${data.total}</td>
`

table.appendChild(row)

})

}

function populateActivity(findings){

const sorted=[...findings].sort((a,b)=>new Date(b.date)-new Date(a.date))

const feed=document.getElementById("activityFeed")
feed.innerHTML=""

sorted.slice(0,10).forEach(f=>{

const item=document.createElement("li")

item.innerText=`${f.severity} – ${f.title} – ${f.asset}`

feed.appendChild(item)

})

}

setTimeout(()=>{
location.reload()
},60000)
