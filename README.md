### Status Code Explanation

400: Bad Request - The request was invalid or cannot be processed.
404: Not Found - The requested resource could not be found.
401: Unauthorized - Authentication is needed to access the requested resource.
200: OK - The request was successful.
201: Created - The request was successful and a new resource was created.
500: Internal Server Error - The server encountered an unexpected condition that prevented it from fulfilling the request.

301: Moved Permanently - The requested resource has been assigned a new permanent URI and any future references to this resource should be done using one of the returned URIs.
302: Found - The requested resource resides temporarily under a different URI.
303: See Other - The server sent this response to direct the client to get the requested resource at another URI with a GET request.
304: Not Modified - The requested resource has not been modified since the last request.

307: Temporary Redirect - The requested resource resides temporarily under a different URI.
308: Permanent Redirect - The target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs.

403: Forbidden - The server understood the request, but is refusing to authorize it.
405: Method Not Allowed - The request method is known by the server but is not supported by the target resource.
409: Conflict - The request conflicts with the current state of the target resource.
410: Gone - The target resource is no longer available at the server and no forwarding address is known.
422: Unprocessable Entity - The server understands the content type of the request entity, and the syntax of the request entity is correct, but was unable to process the contained instructions.
