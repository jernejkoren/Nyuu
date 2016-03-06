// this is the default config file

module.exports = {
	
	// usenet server
	// TODO: consider multi-server?
	server: { // connection settings
		connect: {
			host: 'news.example.com',
			port: null,
			
			// SSL options
			rejectUnauthorized: true,
			servername: undefined, // SNI host name
		},
		secure: false, // set to 'true' to use SSL
		user: null,
		password: null,
		timeout: 60000, // in ms
		connTimeout: 30000, // in ms
		reconnectDelay: 5000, // in ms
		connectRetries: 3,
		postRetries: 1, // how many times to retry if server returns 441 response to posted article
		// TODO: reconnect, max retries etc
	},
	connections: 3, // number of connections
	
	headerCheck: {
		server: {
			// same as 'server' above; missing fields are copied from there
			// TODO: multiple servers?
		},
		connections: 1, // probably not much of a reason to go above 1
		checkDelay: 40*1000, // (in ms) initial delay for performing check
		recheckDelay: 20*1000, // (in ms) delay retries by this amount of time
		tries: 0, // number of retries; should be 0 if not performing header checks
		group: '', // which group to check in; if left blank, will auto determine from posting headers
		ulConnReuse: false, // use uploading connections for header checks; only works if checking the same server as the one being uploaded to
		failAction: 'error', // what to do when header check fails to get the post; options are 'error' (die), 'warn' (ignore and print warning), 'repost' (re-post article)
		// TODO: max repost tries
		maxBuffer: 50, // maximum number of posts in the header-check queue; if this number is exceeded, uploading is paused until the queue is emptied below this size
	},
	
	articleSize: 768000, // must be a multiple of 2
	//articleLines: null,
	bytesPerLine: 128, // note: as per yEnc specifications, it's possible to exceed this number
	
	diskReqSize: 768000, // chunk size when reading from disk
	diskBufferSize: 1536000, // amount of data to buffer; ideally a multiple of articleSize
	articleQueueBuffer: 10, // number of buffered articles; just leave it alone
	
	/**
	 * Folder handling - this can be:
	 *
	 * - skip: skips files in folders
	 * - keep: uploads all files in folders - use the subdirNameTransform to specify what filenames to use
	 * - archive: automatically wraps files into 7z archives (one archive for each folder)
	 * - archiveAll: merges all folders into a single 7z archive
	 */
	subdirs: 'skip',
	// if above setting is 'keep', filenames will be transformed according to this setting
	// the default is to keep the filename component only, which essentially flattens all files into a single directory
	// this is similar to how other clients handle folders
	subdirNameTransform: function(fileName, pathName, fullPath) { return fileName; },
	// another example: include path, seperated by dashes (e.g. "MyFolder - SubFolder - SomeFile.txt")
	// subdirNameTransform: function(fileName, pathName, fullPath) { return pathName.replace(/\//g, ' - ') + fileName; },
	
	comment: '', // subject pre-comment
	comment2: '', // subject post-comment
	// TODO: subject format
	
	// if any of the following are functions, they'll be called with args(filename, part, parts, size)
	postHeaders: {
		// required headers
		Subject: null, // will be overwritten if set to null
		From: (process.env.USER || process.env.USERNAME || 'user').replace(/[<>]/g, '') + ' <' + (process.env.USER || process.env.USERNAME || 'user').replace(/[" (),:;<>@]/g, '') + '@' + require('os').hostname().replace(/[^a-z0-9_.\-]/ig, '') + '>', // 'A Poster <a.poster@example.com>'
		Newsgroups: 'alt.binaries.test', // comma seperated list
		Date: (new Date()).toUTCString(),
		Path: '',
		//'Message-ID': function() { return require('crypto').pseudoRandomBytes(24).toString('hex') + '@nyuu'; },
		
		// optional headers
		//Organization: '',
		'User-Agent': 'Nyuu'
	},
	
	nzb: {
		writeTo: '', // TODO: filename, output stream (eg stdout) etc
		writeOpts: {
			//mode: 0666,
			encoding: 'utf-8',
		},
		minify: false,
		compression: '', // can be 'gzip', 'zlib', 'deflate', 'xz' or '' (none)
		compressOpts: {}, // options for zlib
		metaData: {
			client: 'Nyuu',
		},
	},
	
};
