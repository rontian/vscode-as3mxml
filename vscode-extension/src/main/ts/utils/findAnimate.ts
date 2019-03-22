import * as fs from "fs";
import * as path from "path";

const ANIMATE_PATH_WINDOWS_REGEXP = /^c:\\Program Files( \(x86\))?\\Adobe\\Adobe (Animate|Flash) [\w \.]+$/i;

const ADOBE_FOLDERS_WINDOWS =
[
	"c:\\Program Files\\Adobe",
	"c:\\Program Files (x86)\\Adobe"
];
const EXE_NAMES_WINDOWS =
[
	"Animate.exe",
	"Flash.exe",
];

export default function findAnimate(): string
{
	if(process.platform === "win32")
	{
		let animatePath: string = null;
		ADOBE_FOLDERS_WINDOWS.find((folderPath) =>
		{
			let files = fs.readdirSync(folderPath);
			files.find((filePath) =>
			{
				filePath = path.resolve(folderPath, filePath);
				if(fs.statSync(filePath).isDirectory() && ANIMATE_PATH_WINDOWS_REGEXP.test(filePath))
				{
					EXE_NAMES_WINDOWS.find((exeName) =>
					{
						let exePath = path.resolve(filePath, exeName);
						if(fs.existsSync(exePath) && !fs.statSync(exePath).isDirectory())
						{
							animatePath = exePath;
							return true;
						}
						return false;
					});
				}
				return animatePath !== null;
			});
			return animatePath !== null;
		});
		return animatePath;
	}
	return null;
}