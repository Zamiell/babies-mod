# Imports
use strict;
use warnings;

my $base_anm2 = "001.000_player_co-op.anm2";
my $gfx_directory = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\resources\\gfx\\characters\\player2";
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
	system "perl -pi.bak -e \"s/001isaac_2p\\.png/$file_name/g\" \"$destination\"";
	system "rm \"$destination.bak\"";
}