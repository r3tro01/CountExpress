function getLibroMayor() {
    fetch('/get-cuentas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const libroMayor = document.querySelector("#libroMayor");
            let html = "";
            data.catalogo.forEach(cuenta => {
                if (cuenta.tipo == "mayor") {
                    html += `
                    <div class="col-4">
                        <table class="table table-bordered table-hover" style="border: 1px black solid">
                            <thead>
                                <tr style="border: 2px black solid">
                                    <th class="text-center" colspan="3">${cuenta.id + " - " + cuenta.nombre}</th>
                                </tr>
                                <tr>
                                    <th class="text-center">Partida</th>
                                    <th>Debe</th>
                                    <th>Haber</th>
                                </tr>
                            </thead>
                            <tbody id="filasLibroMayor-${cuenta.id}">
                            </tbody>
                        </table>
                    </div>`;
                    getPartidas(cuenta.id);
                }
            });
            libroMayor.innerHTML = html;
        }
    );
}


// lee las partidas y las muestra en la pantalla
function getPartidas(cuentaId) {
    fetch('/get-partidas', { method: 'GET' }).then(
        res => { return res.json() }
    ).then(
        data => {
            const filas = document.querySelector(`#filasLibroMayor-${cuentaId}`);
            let n_partida = 0;
            let html = "";
            let totalDebe = 0;
            let totalHaber = 0;
            data.libro.forEach(partida => {
                n_partida++;
                
                partida.cuentas.forEach(cuenta => {

                    if (cuenta.idCuenta == cuentaId) {
                        if (cuenta.debe != 0) {
                            html += `
                            <tr>
                                <td class="text-center">${n_partida}</td>
                                <td><input type="text" class="form-control" value="${cuenta.debe.toFixed(2)}" disabled="disabled"></td>
                                <td><input type="text" class="form-control" value="0" disabled="disabled"></td>
                            </tr>`;
                            totalDebe+=cuenta.debe;
                        } else if (cuenta.haber != 0) {
                            html += `
                            <tr>
                                <td class="text-center">${n_partida}</td>
                                <td><input type="text" class="form-control" value="0" disabled="disabled"></td>
                                <td><input type="text" class="form-control" value="${cuenta.haber.toFixed(2)}" disabled="disabled"></td>
                            </tr>`;
                            totalHaber+=cuenta.haber;
                        }
                    }
                });
            });
            html += `
                <tr style="font-weight:bold;">
                    <td>Totales</td>
                    <td><input type="text" class="form-control text-dark" value="${totalDebe.toFixed(2)}" disabled="disabled"></td>
                    <td><input type="text" class="form-control text-dark" value="${totalHaber.toFixed(2)}" disabled="disabled"></td>
                </tr>`;
            let moviento = totalDebe - totalHaber;
            if (moviento > 0) {
                html += `
                <tr style="font-weight:bold;">
                    <td>Resultado</td>
                    <td><input type="text" class="form-control text-warning" value="${Math.abs(moviento.toFixed(2))}" disabled="disabled"></td>
                    <td></td>
                </tr>`;
            }else {
                html += `
                <tr style="font-weight:bold;">
                    <td>Resultado</td>
                    <td></td>
                    <td><input type="text" class="form-control text-primary" value="${Math.abs(moviento.toFixed(2))}" disabled="disabled"></td>
                </tr>`;
            }
            filas.innerHTML = html;
        }
    );
}



getLibroMayor();