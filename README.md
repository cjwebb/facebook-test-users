facebook-test-users
===================

Development has been abandoned. The aim of the project was to alleviate the slow response times from Facebook when creating test users during continuous integration. 
The very same week this was started, Facebook got a lot faster. Which was nice.

As a result, the slowness wasn't a big enough issue to pursue, and the project was abandoned.

The committed version was successfully used in CI, but had minimal gains.

If you wish to fork it, here is a short list of things that need addressing:
 * refactoring duplicate code.
 * retries when Facebook returns error.
 * useful errors upon OAuthExceptions.
 * actually delete facebook users on delete endpoint.