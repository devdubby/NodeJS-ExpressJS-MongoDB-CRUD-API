var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	postId: { type: Number, unique: true, min: 10000001 },
	post: {
		postTypeCd: Number,
		dispAreaCd: Number,
		dispCtgCd: Number,
		title : String,
		subTitle : String,
		imageUrl : String,
		replaceText : String,
		linkUrl : String
	},
	post_content: [{
			postContentTypeCd: Number,
			content_list: [
				{contentTypeCd: Number, contentData: String},
				{contentTypeCd: Number, contentData: String},
				{contentTypeCd: Number, contentData: String}
			]
	}],
	post_item: [{
		itemNm: String, 
        price: Number, 
        brand: String, 
        description: String, 
        imageUrl: String, 
        replaceText: String, 
		linkUrl: String
	}]
});
module.exports = mongoose.model('postMagazine', postSchema);