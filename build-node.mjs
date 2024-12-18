// This is a quick debugging script
// so I can run things from the commandline

import * as esbuild from 'esbuild';

const args = process.argv.slice(2);

const watch = args[0] == 'watch';

async function go () {
  const ctx = await esbuild.context({
	 entryPoints: ['./src/pent-icos.ts'],
	 minify: false,
	 sourcemap: true,
	 bundle: true,
	 outfile: './out/bundle.js',
	 logLevel: 'info',
  })

  if (watch) {
	 await ctx.watch();
  }
  else {
	 const result = await ctx.rebuild()
	 ctx.dispose();
  }
}

go();
