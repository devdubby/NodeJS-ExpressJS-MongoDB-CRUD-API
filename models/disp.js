// const disp = {
// 	dispArea: {
// 		"10": "area1",
// 		"20": "area2",
// 		"30": "area3"
// 	}
// };

// module.exports = disp;

const disp = () => { // 빈즈패턴
	const dispArea = {
			"10": "area1",
			"20": "area2",
			"30": "area3"
		}
	return {
		getDispArea : (code) => dispArea[code],
		getKeys : () => Object.keys(dispArea),
		getSize : () => Object.keys(dispArea).length
	}
}
;

module.exports = disp();