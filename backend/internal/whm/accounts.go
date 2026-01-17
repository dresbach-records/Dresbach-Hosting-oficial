package whm

import (
	"fmt"
	"net/http"
	"net/url"
)

// CreateAccount sends a request to the WHM API to create a new hosting account.
// See: https://documentation.cpanel.net/display/DD/WHM+API+1+Functions+-+createacct
func (c *Client) CreateAccount(domain, username, password, plan string) (*http.Response, error) {
	// URL encode parameters to handle special characters
	safePassword := url.QueryEscape(password)

	endpoint := fmt.Sprintf(
		"createacct?api.version=1&username=%s&domain=%s&password=%s&plan=%s",
		username,
		domain,
		safePassword,
		plan,
	)
	return c.Request(endpoint, "GET", nil)
}

// SuspendAccount suspends a hosting account.
func (c *Client) SuspendAccount(user, reason string) (*http.Response, error) {
	endpoint := fmt.Sprintf("suspendacct?api.version=1&user=%s&reason=%s", user, reason)
	return c.Request(endpoint, "GET", nil)
}

// UnsuspendAccount unsuspends a hosting account.
func (c *Client) UnsuspendAccount(user string) (*http.Response, error) {
	endpoint := fmt.Sprintf("unsuspendacct?api.version=1&user=%s", user)
	return c.Request(endpoint, "GET", nil)
}
