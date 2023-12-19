let statusCode = {
    serverSideError: 500,
    success:200,
    BadReq:400,
    unauthrised:401,
    Created: 200,
    notFound:404
}
let Message= {
    videoCreate: "New video posted by admin",
    adminAccess:" only admin access",
    serverError: "server side error",
    dataNotFound: "Record not found in the database",
    dataUpdated: "Record updated in the database",
    dataDeleted: "Record deleted",
    URL: "Please enter valid URL"
}
export {Message, statusCode}