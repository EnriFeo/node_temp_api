if(monumenti.length > 0){

    monumenti.forEach(monumento => {
        var opere;
        //console.log(monumento);
        try {
            opere = monumento['Opere'];
        }
        catch(e) {}
        finally {

            if(opere != undefined) {
                opere.forEach(opera => {

                    /*conn.query("SELECT * FROM opera_d_arte WHERE opera_d_arte.nome = ?", [opera.nome], (err, result) => {
                        if(err) {
                            return res.status(500);
                        }
                        if(result.length > 0) {

                        }
                    })*/

                    const autore = opera['Autore'];
                    var autoreId;
                    conn.query("SELECT autore.id FROM autore WHERE autore.nome = ? AND autore.anno_nascita = ?", [autore.nome, autore.anno_pubblicazione], (err, result) => {
                        if(err) {
                            return res.status(500);
                        }
                        if(result.length > 0) {
                            autoreId = result[0].id;
                        }
                        else {

                            var periodi;
                            var periodoId = undefined;
                            try {
                                periodi = autore['periodi'];
                            }
                            catch(e) {}
                            finally {
                                if (periodi != undefined) {
                                    periodi.forEach(periodo => {
                                        //inserisci periodo
                                        console.log(periodo);
                                        conn.query("SELECT corrente.id FROM corrente WHERE corrente.nome = ?", [periodo], (err, result) => {
                                            console.log(periodo);
                                            if(err){
                                                return res.status(500);
                                            }
                                            else{
                                                if(result.length > 0){
                                                    periodoId = result[0].id;
                                                }
                                                else {
                                                    conn.query("INSERT INTO corrente(nome) VALUE(?)", [periodo], (err, res) => {
                                                        if(err) {
                                                            return res.status(500);
                                                        }
                                                        periodoId = res.insertId;
                                                    })
                                                }
                                            }
                                        })
                                    })
                                    //console.log(`${periodi}\ninseriti...`);
                                }
                                conn.query
                            }
                            if(autore['periodi'] != undefined){
                                conn.query("")
                            }
                            //inserisci autore
                            //console.log(`${autore}\ninserito...`);
                        }

                    })

                    //inserisci opere
                    conn.query("INSERT INTO opera_d_arte(nome, autore_id, data, dimensioni) VALUES(?, ?, ?, ?)", [opera.nome, autoreId, opera.data, opera.dimensioni], (err, res) => {
                        
                    })

                })   
                //console.log(`${opere}\ninserite...`)
            }

        }

        //inserisci monumento

    });

    return res.json({'message': "ci sono dei monumenti"}).status(200);
}