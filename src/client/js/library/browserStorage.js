define([

], function (
	
) {
	const getEntryName = key => {
		return `asrpg_${key.toLowerCase()}`;
	};

	return {
		get: key => {
			const keyName = getEntryName(key);

			const { [keyName]: value = '{unset}' } = localStorage;

			return value;
		},

		set: (key, value) => {
			const keyName = getEntryName(key);

			localStorage.setItem(keyName, value);
		}
	};
});
