<?php

class Request {
	private $userFactory;
	public $url_elements;
	public $verb;
	public $parameters;
	public $authHeader;

	public function __construct() {
		$this->verb         = $_SERVER['REQUEST_METHOD'];
		$this->url_elements = explode( '/', str_replace( $_SERVER['SCRIPT_NAME'], '', $_SERVER['PHP_SELF'] ) );
		$this->parseIncomingParams();
		$this->authHeader = $this->get_header( [ 'Authorization' ] );
		$this->userFactory = new UserFactory($this);
		
		// initialise json as default format
		$this->format = 'json';
		if ( isset( $this->parameters[ 'format' ] ) ) {
			$this->format = $this->parameters[ 'format' ];
		}
		return true;
	}

	private function parseIncomingParams() {
		$parameters = array();

		// first of all, pull the GET vars
		if ( isset( $_SERVER['QUERY_STRING'] ) ) {
			parse_str( $_SERVER['QUERY_STRING'], $parameters );
		}

		// now how about PUT/POST bodies? These override what we got from GET
		$body         = file_get_contents( "php://input" );
		$content_type = false;
		if ( isset( $_SERVER["CONTENT_TYPE"] ) ) {
			$content_type = $_SERVER["CONTENT_TYPE"];
		} else {
			$content_type = "application/json";
		}
		switch ( $content_type ) {
			case "application/json;charset=utf-8":
			case "application/json":
				$body_params = json_decode( $body );
				if ( $body_params ) {
					foreach ( $body_params as $param_name => $param_value ) {
						$parameters[ $param_name ] = $param_value;
					}
				}
				$this->format = "json";
				break;
			case "application/x-www-form-urlencoded":
				parse_str( $body, $postvars );
				foreach ( $postvars as $field => $value ) {
					$parameters[ $field ] = $value;

				}
				$this->format = "html";
				break;
			default:
				// we could parse other supported formats here
				break;
		}
		$this->parameters = $parameters;
	}

	public function get_header( $headerKeyInput ) {
		// Expanded for clarity.
		$headerKey   = str_replace( '-', '_', $headerKeyInput );
		$headerKey   = strtoupper( $headerKey );
		$headerValue = null;
		// Uncomment the if when you do not want to throw an undefined index error.
		// I leave it out because I like my app to tell me when it can't find something I expect.
		if ( array_key_exists( $headerKey, $_SERVER ) ) {
			$headerValue = $_SERVER[ $headerKey ];
		}

		return $headerValue;
	}
	
	public function getUser() {
		return $this->userFactory->getUser();
	}
}
