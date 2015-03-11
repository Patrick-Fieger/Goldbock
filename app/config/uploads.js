module.exports = {
	images : {
		encoding : 'utf-8',
		multiples : true,
		maxFieldsSize : toMB(20),
		maxFields : 0,
		keepExtensions : true
	},
	video : {
		encoding : 'utf-8',
		maxFieldsSize : toMB(70),
		keepExtensions : true
	}
}

function toMB(size){
	return size * 1024 * 1024
}