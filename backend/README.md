# General Notes:

_return resource directly if no modifications are needed. Use response for more control_

-   return new BranchResource($branch);
-   return response(new BranchResource($branch), 200);

# Configuration Tables:

1. Warehouse type

# CODES

<!-- ------------------------- 1xx: Informational -------------------------- -->

> 100 Continue
> 101 Switching Protocols
> 102 Processing (WebDAV)
> 103 Early Hints

<!-- ---------------------------- 2xx: Success ----------------------------- -->

> 200 OK
> 201 Created
> 202 Accepted
> 203 Non-Authoritative Information
> 204 No Content
> 205 Reset Content
> 206 Partial Content
> 207 Multi-Status (WebDAV)
> 208 Already Reported (WebDAV)
> 226 IM Used (HTTP Delta encoding)

<!-- -------------------------- 3xx: Redirection --------------------------- -->

> 300 Multiple Choices
> 301 Moved Permanently
> 302 Found
> 303 See Other
> 304 Not Modified
> 305 Use Proxy
> 306 Switch Proxy (Unused)
> 307 Temporary Redirect
> 308 Permanent Redirect

<!-- ------------------------- 4xx: Client Errors -------------------------- -->

> 400 Bad Request
> 401 Unauthorized
> 402 Payment Required (Unused)
> 403 Forbidden
> 404 Not Found
> 405 Method Not Allowed
> 406 Not Acceptable
> 407 Proxy Authentication Required
> 408 Request Timeout
> 409 Conflict
> 410 Gone
> 411 Length Required
> 412 Precondition Failed
> 413 Payload Too Large
> 414 URI Too Long
> 415 Unsupported Media Type
> 416 Range Not Satisfiable
> 417 Expectation Failed
> 418 I'm a teapot (RFC 2324)
> 421 Misdirected Request
> 422 Unprocessable Entity (WebDAV)
> 423 Locked (WebDAV)
> 424 Failed Dependency (WebDAV)
> 425 Too Early
> 426 Upgrade Required
> 427 Unassigned
> 428 Precondition Required
> 429 Too Many Requests
> 430 Unassigned
> 431 Request Header Fields Too Large
> 451 Unavailable For Legal Reasons

<!-- ------------------------- 5xx: Server Errors -------------------------- -->

> 500 Internal Server Error
> 501 Not Implemented
> 502 Bad Gateway
> 503 Service Unavailable
> 504 Gateway Timeout
> 505 HTTP Version Not Supported
> 506 Variant Also Negotiates
> 507 Insufficient Storage (WebDAV)
> 508 Loop Detected (WebDAV)
> 510 Not Extended
> 511 Network Authentication Required
