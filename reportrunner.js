let Report = require('fluentreports').Report;

module.exports.generateReport = function (todos) {
    console.log("Running Report");
    console.log(todos);
    let rpt = new Report("Report.pdf")
        .pageHeader(["Todos"])      // Add a simple (optional) page Header...        
        .data(todos)                         // Add some Data (This is required)
        .detail([['title', 200], ['completed', 50]]) // Layout the report in a Grid of 200px & 50px
        .render(function (err, report) {
            if (err) {
                console.log(err);
            } else {
                console.log("done creating report: ", report);
            }
        });
}
