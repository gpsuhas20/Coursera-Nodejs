const mongoose=require('mongoose');
const Schema=mongoose.Schema;
var favdishesSchema=new Schema(
    {
        dish:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Dish"
        }
    }
)

var favoriteSchema=new Schema(
    {
        user:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"// name that is exported from the file.
        },
        dishes:[favdishesSchema]
    }
)

var Favorites=mongoose.model("Favorite",favoriteSchema)

module.exports=Favorites;