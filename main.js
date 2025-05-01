const canvas = d3.select(".canva");

const svg = canvas.append("svg")
    .attr("width", "100%")
    .attr("height", 600)
    .attr("viewBox", "0 0 1000 600")
    .attr("preserveAspectRatio", "xMidYMid meet");

const margin = {top: 60, right: 20, bottom: 70, left: 70};
const graphWidth = 1000 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const mainCanvas = svg.append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const formatComma = d3.format(",");
const formatDecimal = d3.format(".2f");

const tip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function(d) {
        //calculate points per game
        const ppg = formatDecimal(d.points / d.games);
        
        return `<div>
            <h3>Season: ${d.season}</h3>
            <p>Team: <span style='color:#FDB927'>${d.team}</span></p>
            <p>Games: <span style='color:#FDB927'>${d.games}</span></p>
            <p>Total Points: <span style='color:#FDB927'>${formatComma(d.points)}</span></p>
            <p>PPG: <span style='color:#FDB927'>${ppg}</span></p>
        </div>`;
    });

mainCanvas.call(tip);

d3.json("kobe_bryant.json").then(function(data) {
    //process the data if it's an array of seasons
    let kobeData = Array.isArray(data) ? data : [data];
    
    //calculate points per game for each season
    kobeData.forEach(season => {
        season.pointsPerGame = season.points / season.games;
    });
    
    //create a scale for circle radius based on points
    const radiusScale = d3.scaleLinear()
        .domain(d3.extent(kobeData, d => d.points))
        .range([20, 60]);
    
    //use the center of the available graph area
    const centerX = graphWidth / 2;
    const centerY = graphHeight / 2;
    
    const simulation = d3.forceSimulation(kobeData)
        .force("x", d3.forceX(centerX).strength(0.1))  
        .force("y", d3.forceY(centerY).strength(0.1))  
        .force("collide", d3.forceCollide().radius(d => radiusScale(d.points) + 8).strength(0.8))
        .velocityDecay(0.4)
        .alphaTarget(0)
        .alphaDecay(0.01);
    
   //circles for each season
const circles = mainCanvas.selectAll("circle")
.data(kobeData)
.enter()
.append("circle")
.attr("r", d => radiusScale(d.points))
.attr("fill", "#FDB927") 
.attr("stroke", "#552583")
.attr("stroke-width", 2)
.attr("data-season", d => d.season) //store season in HTML attribute explicitly
.style("cursor", "pointer")
.on("mouseover", tip.show)
.on("mouseout", tip.hide)
.on("click", function () {
    const seasonStr = d3.select(this).attr("data-season");
    if (seasonStr) {
        window.location.href = `seasons/season_${seasonStr}.html`;
    } else {
        alert("Season not found for this circle");
    }
});

//add season year labels to circles
const labels = mainCanvas.selectAll(".label")
.data(kobeData)
.enter()
.append("text")
.attr("class", "season-label")
.text(d => d.season)
.attr("text-anchor", "middle")
.attr("fill", "#552583")
.attr("font-weight", "bold")
.attr("font-size", d => radiusScale(d.points) / 3)
.attr("data-season", d => d.season) // <--- store it here too
.style("cursor", "pointer")
.on("click", function () {
    const seasonStr = d3.select(this).attr("data-season");
    if (seasonStr) {
        window.location.href = `seasons/season_${seasonStr}.html`;
    } else {
        alert("Season not found for this label");
    }
});
    
    kobeData.forEach(d => {
        d.x = centerX;
        d.y = centerY;
    });
    
    simulation.on("tick", () => {
        circles
            .attr("cx", d => Math.max(radiusScale(d.points), Math.min(graphWidth - radiusScale(d.points), d.x)))
            .attr("cy", d => Math.max(radiusScale(d.points), Math.min(graphHeight - radiusScale(d.points), d.y)));
            
        labels
            .attr("x", d => Math.max(radiusScale(d.points), Math.min(graphWidth - radiusScale(d.points), d.x)))
            .attr("y", d => Math.max(radiusScale(d.points), Math.min(graphHeight - radiusScale(d.points), d.y + 5)));
    });
    
    
    //kobe image
    svg.append("image")
        .attr("href", "kobe_dunk.png")
        .attr("x", -250)       
        .attr("y", 70)      
        .attr("width", 500)  
        .attr("height", 500); 

    //lakers logo
    svg.append("image")
        .attr("href", "lakers_logo.png")
        .attr("x", 850)       
        .attr("y", 100)     
        .attr("width", 300)   
        .attr("height", 300);

}).catch(error => {
    console.error("Error loading the data:", error);
    mainCanvas.append("text")
        .attr("x", graphWidth / 2)
        .attr("y", graphHeight / 2)
        .attr("text-anchor", "middle")
        .text("Error loading data. Please check console for details.")
        .attr("fill", "white");
});