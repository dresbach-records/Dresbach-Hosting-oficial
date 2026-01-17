package whm

import (
	"net/http"
)

// ListPackages retrieves all hosting packages (plans) from WHM.
func (c *Client) ListPackages() (*http.Response, error) {
	return c.Request("listpkgs?api.version=1", "GET", nil)
}
