$(document).ready(function () {
    //CARGAR Y PINTAR DASHBOARD//////////////////////////////////////////////////////////

    //CARGAR Y PINTAR DASHBOARD//////////////////////////////////////////////////////////
    $.get("json/dashboard.json", function (resp) {
        console.log("Cargado dash: ", resp.hits.hits)
        var actualLoadDashboard = resp.hits.hits[0];
        

        for (var i = 0; i < actualLoadDashboard._source.charts.length; i++) {
            $.get("json/"+ actualLoadDashboard._source.charts[i].id+ ".json", function (resp) {
                console.log("Cargado chart: ", resp.hits.hits[0])
                var chart = resp.hits.hits[0];

                for (var i = 0; i < actualLoadDashboard._source.charts.length; i++) {
                    if (actualLoadDashboard._source.charts[i].id == chart._id) {
                        addVisToDash(chart, actualLoadDashboard._source.charts[i].x, actualLoadDashboard._source.charts[i].y, actualLoadDashboard._source.charts[i].z, actualLoadDashboard._source.charts[i].rotx, actualLoadDashboard._source.charts[i].roty, actualLoadDashboard._source.charts[i].rotz);
                    }
                }
            })
        }
    })

    //////////////////////////////////////AÑADIR VIS A DASHBOARD//////////////////////
    var addVisToDash = function (visall, posx, posy, posz, rotx, roty, rotz) {
        console.log("A AÑADIR", visall);

        vis = visall._source;


        switch (vis.chartType) {
            case "pie":
                var chart = aframedc.pieChart().data(vis.data).depth(1).setId(visall._id);
                dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
                posx += 150;
                break
            case "bars":
                var chart = aframedc.barChart().data(vis.data).setId(visall._id);
                dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
                posx += 150;
                break;
            case "curve":
                var chart = aframedc.smoothCurveChart().data(vis.data).setId(visall._id);
                dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
                posx += 150;
                break;
            case "3DBars":
                var chart = aframedc.barChart3d().data(vis.data).setId(visall._id);
                dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
                posx += 150;
                break;
            case "bubbles":
                var chart = aframedc.bubbleChart().data(vis.data).setId(visall._id);
                dash.addChart(chart, { x: posx, y: posy, z: posz }, { x: rotx, y: roty, z: rotz })
                posx += 150;
                break;
            default:
                console.log("Esta vacío")
                return
        }

    }////////////////////////////////////////////////

    ///////////////////////////////////////////THREEDC/////////////////////////////////////////
    var container = document.getElementById('AframeDCShow');
    let dash = aframedc.dashboard(container);
    let backgroundEntity = document.createElement("a-entity")
    backgroundEntity.setAttribute("id", "skymap")
    backgroundEntity.setAttribute("visible", {})
    backgroundEntity.setAttribute("environment", "preset: egypt;");
    dash.appendChild(backgroundEntity)
    /////////////////////////////////////////////////////////////////////////////////////
});