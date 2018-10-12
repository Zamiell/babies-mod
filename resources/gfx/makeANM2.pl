# Imports
use strict;
use warnings;

my $base_anm2 = "001.000_player_co-op.anm2";
my $gfx_directory = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\resources\\gfx\\characters\\player2";
my $gfx_directory2 = "C:\\Users\\james\\Documents\\My Games\\Binding of Isaac Afterbirth+ Mods\\single_player_coop_babies_dev\\resources\\gfx\\co-op-familiars";
my $spcglobals = "C:\\Users\\james\\Documents\\My Games\\Binding of Isaac Afterbirth+ Mods\\single_player_coop_babies_dev\\src\\SPCGlobals.lua";

for my $file_name (`ls "$gfx_directory"`) {
	chomp($file_name);

	if ($file_name eq "001isaac_2p.png") {
		# This is not a real co-op baby
		next;
	}

	print("$file_name\n");

	my $baby_num = substr($file_name, 0, 3);
	$baby_num += 0; # Convert it to a number
	if ($baby_num == 0) {
		# Move Baby Spider from 0 to 521 because we want our babies to be 1-indexed
		$baby_num = 521;
	}

	my $destination = "co-op/$baby_num.anm2";
	system "cp \"$base_anm2\" \"$destination\"";

	# We want the original anm2 file to not have ".." so that the paths stay intact for use in the animation editor
	my $find = "characters\\/player2\\/001isaac_2p.png";
	my $replace = "\\.\\.\\/characters\\/player2\\/$file_name";
	system "perl -pi.bak -e \"s/$find/$replace/g\" \"$destination\"";
	$find = "characters\\/costumes\\/ghost.png";
	$replace = "\\.\\.\\/characters\\/costumes\\/ghost.png";
	system "perl -pi.bak -e \"s/$find/$replace/g\" \"$destination\"";
	system "rm \"$destination.bak\"";
}

for my $file_name (`ls "$gfx_directory2"`) {
	chomp($file_name);

	print("$file_name\n");

	my $baby_num = substr($file_name, 0, 3);
	$baby_num += 0; # Convert it to a number

	my $destination = "co-op/$baby_num.anm2";
	system "cp \"$base_anm2\" \"$destination\"";

	# We want the original anm2 file to not have ".." so that the paths stay intact for use in the animation editor
	my $find = "characters\\/player2\\/001isaac_2p.png";
	my $replace = "\\.\\.\\/co-op-familiars\\/$file_name";
	system "perl -pi.bak -e \"s/$find/$replace/g\" \"$destination\"";
	$find = "characters\\/costumes\\/ghost.png";
	$replace = "\\.\\.\\/characters\\/costumes\\/ghost.png";
	system "perl -pi.bak -e \"s/$find/$replace/g\" \"$destination\"";
	system "rm \"$destination.bak\"";
}