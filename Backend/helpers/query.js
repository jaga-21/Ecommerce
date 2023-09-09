//                         name: productInfo.name,
//                         brand: productInfo.brand,
//                         price: productInfo.price,
//                         category: productInfo.category,
//                         image: productInfo.image,
//                         rating: productInfo.rating,
//                         type: productInfo.type,
//                         author: productInfo.author,
//                         description: productInfo.description,

const addProduct ="INSERT INTO product (id,name,brand,price,category,image,rating,type,author,description) VALUES (?,?,?,?,?,?,?,?,?,?)"
const registerUser= "INSERT INTO user (full_name,password,phone,email) VALUES (?,?,?,?)";
const getProduct ="SELECT FROM product WHERE id= ?"


const filterMostRecent="SELECT * FROM productreview ORDER BY CreatedAt DESC "
const filterOldReviews=" SELECT * FROM productreview ORDER BY CreatedAt ASC"

const filterNegativeFirst=" SELECT * FROM productreview ORDER BY rating DESC"
const filterPositiveFirst=" SELECT * FROM productreview ORDER BY rating ASC"


const getByCategory="SELECT FROM Product WHERE category = ?"
const modifyUser ="UPDATE user SET firstName=?,lastName=?,password=?,phoneNumber=? WHERE id=?"

const getComments=""
const insertComments="Insert into comments (comment_text,userId,productId,rating) values(?,?,?,?)"

const customQuery ={
    modifyUser,
    registerUser,
    getByCategory,
    addProduct,
    getProduct,
    filterMostRecent,
    filterOldReviews,
    filterNegativeFirst,
    filterPositiveFirst,
    insertComments
}
export default customQuery
