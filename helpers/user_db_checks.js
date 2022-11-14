const userExists = async (db, user_id)=>{
    let found = await db.findOne({
        where: {
            user_id: user_id
        }
    })
    if(found !== null){
        return true
    }
    return false
}

const noUserIdDuplicates = async (db, user_id)=>{
    let user = await db.findOne({
        where: {
            user_id: user_id
        }
    })
    if(user){
        return false
    }
    return true
}

module.exports = { userExists, noUserIdDuplicates }