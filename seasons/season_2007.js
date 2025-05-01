d3.json("kobe_bryant.json").then(data => {
    const seasonData = data.find(d => d.season === 2007);
    if (!seasonData) {
        console.error("2007 season not found.");
        return;
    }

    const width = 800;
    const height = 600;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "0 auto")
        .style("background", "#f5f5f5");

    const court = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2 + 300}) scale(1.5)`);

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("padding", "20px 30px")
        .style("border-radius", "5px")
        .style("font-size", "20px")
        .style("pointer-events", "none")
        .style("visibility", "hidden");

    // Data formatting
    const threeFg = seasonData.threeFg;
    const threeAttempts = seasonData.threeAttempts;
    const threePercent = ((threeFg / threeAttempts) * 100).toFixed(1);
    const threePoint = (threeFg * 3);

    const twoFg = seasonData.twoFg;
    const twoAttempts = seasonData.twoAttempts;
    const twoPercent = ((twoFg / twoAttempts) * 100).toFixed(1);
    const twoPoint = (twoFg *2);

    const ft = seasonData.ft;
    const ftAttempts = seasonData.ftAttempts;
    const ftPercent = ((ft / ftAttempts) * 100).toFixed(1);

    // Define color pairs for normal and hover states
    const colorPairs = {
        "ft": { normal: "gold", hover: "#ffffa0" },          // Lighter gold
        "two": { normal: "orange", hover: "#ffcc80" },       // Lighter orange
        "three": { normal: "crimson", hover: "#ff6b6b" }     // Lighter crimson
    };

    // Helper to draw an arc area
    const drawZone = (innerR, outerR, colorKey, tooltipText) => {
        court.append("path")
            .attr("d", d3.arc()
                .innerRadius(innerR)
                .outerRadius(outerR)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2))
            .attr("fill", colorPairs[colorKey].normal)
            .attr("class", `${colorKey}-zone`)
            .on("mouseover", function (event){
                // Change fill color on hover
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", colorPairs[colorKey].hover);
                    
                tooltip.style("visibility", "visible")
                    .style("opacity", 1)
                    .html(tooltipText)
                    .style("left", "375px")
                    .style("top", "150px");
            })
            .on("mouseout", function() {
                // Restore original color
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", colorPairs[colorKey].normal);
                    
                tooltip.style("visibility", "hidden")
                    .style("opacity", "0");
            });
    };

    // Draw 3 zones (from inside out)
    drawZone(
        0,
        90,
        "ft",
        `FT Area    <br>Attempts: ${ftAttempts}<br>Makes: ${ft}<br>Percentage: ${ftPercent}%<br>Total Point: ${ft}`
    );

    drawZone(
        90,
        220,
        "two",
        `2PT Area<br>Attempts: ${twoAttempts}<br>Makes: ${twoFg}<br>Percentage: ${twoPercent}%<br>Total Point: ${twoPoint}`
    );

    drawZone(
        220,
        280,
        "three",
        `3PT Area<br>Attempts: ${threeAttempts}<br>Makes: ${threeFg}<br>Percentage: ${threePercent}%<br>Total Point: ${threePoint}`
    );

    //title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text("Kobe Bryant - 2007 Scoring Zones");
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .text("Each colored zone represents a scoring area: free throws (yellow), 2-point shots (orange), and 3-point shots (red).");
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .text("Hover over any zone to see detailed statistics, including attempts, makes, shooting percentage, and total points.");
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 235)
        .attr("text-anchor", "middle")
        .attr("fill", "#9B0000")
        .attr("font-size", "35px")
        .attr("font-weight", "bold")
        .text("3pt");
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 390)
        .attr("text-anchor", "middle")
        .attr("fill", "#AD4000")
        .attr("font-size", "35px")
        .attr("font-weight", "bold")
        .text("2pt");
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 560)
        .attr("text-anchor", "middle")
        .attr("fill", "#ABA100")
        .attr("font-size", "35px")
        .attr("font-weight", "bold")
        .text("FT");
});

d3.select("body")
  .append("img")
  .attr("src", "kobe_pic1.png")
  .style("position", "absolute")
  .style("left", "-50px") // adjust to place it to the right of SVG
  .style("top", "150px")
  .style("width", "400px")
  .style("height", "400px");

d3.select("body")
  .append("img")
  .attr("src", "kobe_pic2.png")
  .style("position", "absolute")
  .style("left", "1125px") // adjust to place it to the right of SVG
  .style("top", "150px")
  .style("width", "450px")
  .style("height", "370px");

  d3.select("body")
  .append("div")
  .style("position", "fixed")
  .style("bottom", "20px")
  .style("left", "20px")
  .style("z-index", "1000")
  .append("button")
  .attr("id", "back-button")
  .text("← Back to Stats")
  .style("background-color", "#FDB927") // Lakers gold
  .style("color", "#552583") // Lakers purple
  .style("border", "none")
  .style("border-radius", "5px")
  .style("padding", "10px 20px")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .style("cursor", "pointer")
  .style("box-shadow", "0 2px 5px rgba(0,0,0,0.2)")
  .on("mouseover", function() {
    d3.select(this)
      .style("background-color", "#FFD700") // Slightly brighter gold on hover
      .style("box-shadow", "0 4px 8px rgba(0,0,0,0.3)");
  })
  .on("mouseout", function() {
    d3.select(this)
      .style("background-color", "#FDB927")
      .style("box-shadow", "0 2px 5px rgba(0,0,0,0.2)");
  })
  .on("click", function() {
    window.location.href = "../kobe_stats.html";
  });