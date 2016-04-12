<?php

class UserFactory {

	/**
	 * @var Request
	 */
	private $request;

	public function __construct(Request $request) {
		$this->request = $request;
	}
	
	public function getUser() {
		return new User($this->isLoggedIn(), $this->request->parameters['username'], false);
	}

	private function isLoggedIn() {
		if ( isset( $this->request->authHeader ) ) {
			list( $jwt ) = sscanf( $this->request->authHeader->toString(), 'Authorization: Bearer %s' );
			if ( $jwt ) {
				try {
					$config    = Factory::fromFile( 'config.php', true );
					$secretKey = base64_decode( $config->get( 'jwt' )->get( 'key' ) );
					JWT::decode( $jwt, $secretKey, [ $config->get( 'jwt' )->get( 'algorithm' ) ] );
					return true;
				} catch ( Exception $e ) {
				}
			}
		}

		return false;
	}
}
