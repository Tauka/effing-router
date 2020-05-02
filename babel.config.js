module.exports = {
	presets:
	[
		[
			'@babel/env'
		],
		'@babel/preset-react'
	],
	plugins: 
	[
	  	[
			'@babel/plugin-transform-runtime',
			{ corejs: 3 }
		],
		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-nullish-coalescing-operator"
  	],
	env:
	{
	  test: 
	  {
		presets: 
		[
			[
				'@babel/env',
				{
					targets: { node: 'current' }
				}
			]
		]
	  }
	}
  };