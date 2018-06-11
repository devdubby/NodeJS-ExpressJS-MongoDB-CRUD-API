var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	_id: Number,
	postId : { type: Number, unique: true, required: true, min: 10000001 },
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

var postSchemaSeq = new Schema({
	seq : { type: Number, unique: true, required: true, min: 1000000 },
	back: {
		_id: Number,
		postId: { type: Number, unique: true, required: true, min: 10000001 },
		post: {
			postTypeCd: Number,
			dispAreaCd: Number,
			dispCtgCd: Number,
			title: String,
			subTitle: String,
			imageUrl: String,
			replaceText: String,
			linkUrl: String
		},
		post_content: [{
			postContentTypeCd: Number,
			content_list: [
					{contentTypeCd: Number, contentData: String},
					{contentTypeCd: Number,contentData: String},
					{contentTypeCd: Number,contentData: String}
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
		}
	});

module.exports = (area) => ({ // 모듈패턴
	data: mongoose.model(`post_magazine_${area}`, postSchema),
	seq: mongoose.model(`post_magazine_seq`, postSchemaSeq, `post_magazine_seq`)
})