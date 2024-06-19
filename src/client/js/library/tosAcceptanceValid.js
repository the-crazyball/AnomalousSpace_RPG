define([
	'js/library/browserStorage',
	'js/library/globals'
], function (
	browserStorage,
	globals
) {
	return () => {
		const acceptedVersion = browserStorage.get('tos_accepted_version');
		const currentVersion = globals.clientConfig.tos.version;

		return (acceptedVersion === currentVersion);
	};
});
