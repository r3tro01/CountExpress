var totalMvDeudor = 0;
var totalMvAcreedor = 0;
var totalSalDeudor = 0;
var totalSalAcreedor = 0;

function getBalanceComprobacion() {
    fetch('/get-cuentas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const libroMayor = document.querySelector("#filasBalance");
            let html = "";
            data.catalogo.forEach(cuenta => {
                if (cuenta.tipo == "mayor") {
                    html += `
                    <tr>
                        <td class="text-center">${cuenta.id}</td>
                        <td>${cuenta.nombre}</td>
                        <td id="s-deudor-${cuenta.id}"></td>
                        <td id="s-acreedor-${cuenta.id}"></td>
                    </tr>
                    `;
                    getSaldos(cuenta.id);
                }
            });
            html+=`<tr id="saldos" style="font-weight:bold;"><tr>`;
            libroMayor.innerHTML = html;
        }
    );
}


// lee las partidas y las muestra en la pantalla
function getSaldos(cuentaId) {
    fetch('/get-partidas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const salDeudor = document.querySelector(`#s-deudor-${cuentaId}`);
            const salAcreedor = document.querySelector(`#s-acreedor-${cuentaId}`);
            const saldos = document.querySelector(`#saldos`);
            
            let totalDebe = 0;
            let totalHaber = 0;
            data.libro.forEach(partida => {
                partida.cuentas.forEach(cuenta => {
                    if (cuenta.idCuenta == cuentaId) {
                        if (cuenta.debe != 0) {
                            totalDebe+=cuenta.debe;
                        } else if (cuenta.haber != 0) {
                            totalHaber+=cuenta.haber;
                        }
                    }
                });
                let moviento = totalDebe - totalHaber;

                salDeudor.innerHTML = (moviento > 0) ? `<input class="form-control input-sal-deudor" type="number" value="${Math.abs(moviento).toFixed(2)}" disabled>` : "";
                salAcreedor.innerHTML = (moviento < 0) ? `<input class="form-control input-sal-acreedor" type="number" value="${Math.abs(moviento).toFixed(2)}" disabled>` : "";
            });
            cacularTotales();
            
            if(totalSalDeudor == totalSalAcreedor) {
                saldos.innerHTML = `
                <td></td>
                <th>Totales</th>
                <td><input type="number" class="form-control text-success" value="${totalSalDeudor.toFixed(2)}" disabled ></td>
                <td><input type="number" class="form-control text-success" value="${totalSalAcreedor.toFixed(2)}" disabled ></td>
                `;
            } else {
                saldos.innerHTML = `
                <td></td>
                <th>Totales</th>
                <td><input type="number" class="form-control text-danger" value="${totalSalDeudor.toFixed(2)}" disabled ></td>
                <td><input type="number" class="form-control text-danger" value="${totalSalAcreedor.toFixed(2)}" disabled ></td>
                `;
            }
            
        }
    );
}

function cacularTotales() {
    let inputSalDeudor = document.getElementsByClassName("input-sal-deudor");
    let inputSalAcreedor = document.getElementsByClassName("input-sal-acreedor");

    totalSalDeudor = getTotalSuma(inputSalDeudor);
    totalSalAcreedor = getTotalSuma(inputSalAcreedor);
}

function getTotalSuma(lista){
    let saldo = 0;
    for (let i = 0; i < lista.length; i++) {
        saldo += parseFloat(lista[i].value);
    }
    return saldo;
}

getBalanceComprobacion();