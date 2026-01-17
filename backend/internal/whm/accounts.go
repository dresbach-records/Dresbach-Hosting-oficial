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
// See: https://documentation.cpanel.net/display/DD/WHM+API+1+Functions+-+suspendacct
func (c *Client) SuspendAccount(user, reason string) (*http.Response, error) {
	endpoint := fmt.Sprintf("suspendacct?api.version=1&user=%s&reason=%s", user, reason)
	return c.Request(endpoint, "GET", nil)
}

// UnsuspendAccount unsuspends a hosting account.
// See: https://documentation.cpanel.net/display/DD/WHM+API+1+Functions+-+unsuspendacct
func (c *Client) UnsuspendAccount(user string) (*http.Response, error) {
	endpoint := fmt.Sprintf("unsuspendacct?api.version=1&user=%s", user)
	return c.Request(endpoint, "GET", nil)
}

// RemoveAccount terminates a hosting account.
// See: https://documentation.cpanel.net/display/DD/WHM+API+1+Functions+-+removeacct
func (c *Client) RemoveAccount(user string) (*http.Response, error) {
	endpoint := fmt.Sprintf("removeacct?api.version=1&user=%s", user)
	return c.Request(endpoint, "GET", nil)
}

// ListAccounts lists all accounts on the server.
// See: https://documentation.cpanel.net/display/DD/WHM+API+1+Functions+-+listaccts
func (c *Client) ListAccounts() (*http.Response, error) {
	endpoint := "listaccts?api.version=1"
	return c.Request(endpoint, "GET", nil)
}

// CreateUserSession creates a temporary session for cPanel, DirectAdmin, etc. (SSO)
// See: https://documentation.cpanel.net/display/DD/WHM+API+1+Functions+-+create_user_session
func (c *Client) CreateUserSession(user, service string) (*http.Response, error) {
	// 'service' is typically 'cpaneld' for cPanel access
	endpoint := fmt.Sprintf("create_user_session?api.version=1&user=%s&service=%s", user, service)
	return c.Request(endpoint, "GET", nil)
}
