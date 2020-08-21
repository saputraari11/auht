const { app, md5, cryptr } = require("../main/main")
const { koneksi } = require("./../main/koneksi")
const db = koneksi("penyewaan_mobil")

const login_user = (link) => {
    return app.post(link, (req, res) => {
        let data = [{ username: req.body.username }, { password: md5(req.body.password) }]
        let sql = "select * from karyawan where ?"

        db.query(sql, data, (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                res.json({ massage: "login success", token: cryptr.encrypt(result[0].id_karyawan), data: result })
            } else {
                res.json({ massage: "Username/Password not found!" })
            }
        })


    })
}
const validate = () => {
    return (req, res, next) => {
        if (!req.get("token")) {
            res.json({ massage: "Token not found!" })
        } else {
            let token = req.get("token")
            let data = { id_karyawan: cryptr.decrypt(token) }

            let sql = "select * from karyawan where ?"

            db.query(sql, data, (err, result) => {
                if (err) throw err

                if (result.length > 0) {
                    next()
                } else {
                    res.json({ massage: "Token not same!" })
                }
            })
        }
    }
}
module.exports = { login_user, validate, db }