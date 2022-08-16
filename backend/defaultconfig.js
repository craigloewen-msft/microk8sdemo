module.exports = {
    'secret': 'somesecret',
    'multichainPort': 4772,
    'multichainHost': '127.0.0.1',
    'multichainUser': 'multichainrpc',
    'multichainPassword': 'devpassword',
    'mongoDBConnectionString': 'mongodb://localhost/MyDatabase',
    'sessionSecret': 'somesessionsecret',
    'adminMultichainAddress': '1EDLGniBpv58zYsyKhkKUEiyJH74aKjKNZ7qsC',
    'adminMultichainPrivKey': 'V7KmHcwWSUoAFpKpb4FFyWAgUgXdMeSF3syQSBWpBt22uhtExekVv5tB'
    // MULTICHAIN_CONNECT_ADDRESS environment variable needs to be set to connect to an external node in production scenarios. e.g: mycryptocoin@123.0.134.1:2765
    // 'MULTICHAIN_CONNECT_PORT also needs to be set as an environment variable '2765',
};