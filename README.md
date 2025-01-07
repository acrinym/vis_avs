# vis_avs - Advanced Visualization Studio

Advanced Visualization Studio (AVS), is a music visualization plugin for Winamp. It was
designed by Winamp's creator, Justin Frankel, among others. AVS has a customizable
design which allows users to create their own visualization effects, or "presets". AVS
was made open source software in May 2005, released under a BSD-style license. —
[Wikipedia](http://en.wikipedia.org/wiki/Advanced_Visualization_Studio)


## Modern Toolchain Port

This fork is a **MingW-w64 GCC 9+** as well as **MSVC 19+** port of AVS.

The goal was to create a **v2.81d**-compliant *vis_avs.dll* version that can be built
with a modern toolchain, which was largely successful. One notable exception being that
APEs (<b>A</b>VS <b>P</b>lugin <b>E</b>ffects) cannot be loaded — so many effects are
integrated as builtin effects instead.


### Current Status

* 🪓 Split into a new `libavs` and the Winamp plugin frontend. Check out the APIs in the
  libavs [header](avs/vis_avs/avs.h) [files](avs/vis_avs/avs_editor.h).
* 🎉 Builds for Windows both with MSVC & MinGW-w64 GCC into a running `vis_avs.dll`,
  loadable with Winamp, as well as `libavs.dll`.
* 🐧 Builds for Linux as `libavs.so`, with pipewire audio input. EEL functions don't
  work yet, but basic EEL code does.  A (very) basic cli frontend and a more interesting
  WIP Rust frontend are also available, both for rendering only, not editing.
* 💾 New JSON file format, which is more accessible for direct editing and inspection.
  The old binary format is still fully supported.
* 💃 Runs most presets (unless they use rare APEs).
* ❤️ Sources of original effects integrated as builtin-APEs, thanks to donations to free
  software by their authors:
  * _ConvolutionFilter_, by [Tom Holden](https://github.com/tholden). Original
    [here](https://github.com/tholden/AVSConvolutionFilter).
  * _TexerII_, by [Steven Wittens](https://acko.net). Original committed to this repo
    [here](https://github.com/grandchild/vis_avs/commit/ddd97ba7).
  * _AVSTrans_, by [TomyLobo](https://github.com/TomyLobo). Original
    [here](https://github.com/TomyLobo/eeltrans). Refactored for this repo.
  * _PictureII_, by [Steven Wittens](https://acko.net).
* 🎂 Former plugin effects rewritten from scratch as builtin-APEs:
  * _Normalise_, originally by [TomyLobo](https://github.com/TomyLobo),
    [here](https://www.deviantart.com/tomylobo/art/Normalise-APE-10334263).
  * _Colormap_, originally by [Steven Wittens](https://acko.net).
  * _AddBorders_, originally by [Goebish](https://github.com/goebish).
  * _Triangle_, originally by [TomyLobo](https://github.com/TomyLobo).
  * _GlobalVariables_, originally by [Semi Essessi](https://github.com/semiessessi).
  * _MultiFilter_, originally by [Semi Essessi](https://github.com/semiessessi).
  * _FramerateLimiter_, originally by [Goebish](https://github.com/goebish).
  * _Texer_, originally by [Steven Wittens](https://acko.net).
* 🥵 Performance is generally the same as the official build, but can be a bit slower
  for some effects. A few effects have gained faster SSE3-enabled versions.


### The Future

* 🧮 64-bit support
* 📟 Standalone port
* ✅ Automated output testing

These are near-future goals, and most are tracked on the
[issues board](https://github.com/users/grandchild/projects/1). For further development
of AVS itself there are _many_ ideas for improvement and known bugs. Have a look at 
[`wishlist.txt`](wishlist.txt) for a list of issues and feature-requests, both old and
new.


## Cross-Compiling & Running on Linux & Wine

### Build

First, install a 32bit MingW-w64 GCC (with C++ support) and and a cross-compiler CMake.

If you want Video support through FFmpeg, you'll need to install 32bit FFmpeg packages
too. This is highly variable depending on your distro, and not described below.

Choose your Linux distro, and run the respective commands to install the build
dependencies and cross-compile AVS:

<details><summary><em>Archlinux / Manjaro</em></summary>

```shell
sudo pacman -S --needed mingw-w64-gcc mingw-w64-cmake
mkdir -p build
cd build
i686-w64-mingw32-cmake ..
make
```

</details>


<details><summary><em>Fedora / RedHat</em></summary>

```shell
sudo dnf install mingw32-gcc-c++ mingw32-gcc
mkdir -p build
cd build
mingw32-cmake ..
make
```

</details>


<details><summary><em>Debian / Ubuntu (& other distros)</em></summary>


```shell
sudo apt install gcc-mingw-w64 g++-mingw-w64 cmake
mkdir -p build
cd build

# Debian- and Ubuntu-based distros don't provide ready-made cross-compiling CMake
# packages, so you'll have to tell CMake about your toolchain.
cmake -D CMAKE_TOOLCHAIN_FILE=../CMake-MingWcross-toolchain.txt ..

make
```

</details>

### Run With Winamp

Once you've compiled `vis_avs.dll`, copy it (and some stdlib DLLs that got introduced by
MinGW) to the Winamp/Plugins folder and run it with Wine:

```bash
cp vis_avs.dll /my/path/to/Winamp/Plugins/

# Not all of these might exist on your system, that's okay, you can ignore errors for
# some of the files.
# You only need to copy these files once in a while, they don't change that often.
cp \
  /usr/i686-w64-mingw32/bin/lib{gcc_s_dw2-1,ssp-0,stdc++-6,winpthread-1}.dll \
  /my/path/to/Winamp/

# If you built with FFmpeg support, you'll need to copy the FFmpeg DLLs too. If you
# don't, AVS will still work, but again without video support.

# Run Winamp
wine /my/path/to/Winamp/winamp.exe
```

### Building & Running Linux native

There's two slightly different test programs for Linux support. One in C, one in Rust.
Both are built automatically with the current CMake setup.

Prepare & build first:

```sh
# Install a 32bit util-linux package which provides libuuid.
# For Archlinux that would be: $ sudo pacman -S lib32-util-linux

# *Optionally* install a 32bit libpipewire for automatic audio input on Linux.
# For Archlinux that would be: $ sudo pacman -S lib32-libpipewire

# Install Rust 32bit linux toolchain
rustup target add i686-unknown-linux-gnu

# Compile
cmake -B build_linux --toolchain CMake-Linux32cross-toolchain.txt
cmake --build build_linux --parallel $(nproc)
```

Then run either the C version, which prints individual low-res test frames to the
terminal or the Rust version, which opens a window with realtime AVS. For both you need
to set `LD_LIBRARY_PATH` to the build directory, so the binaries can find `libavs.so`:

```sh
LD_LIBRARY_PATH=build_linux build_linux/avs-cli
```

or the Rust version:
```sh
LD_LIBRARY_PATH=build_linux build_linux/avs /path/to/some/preset.avs
# Press Q or Esc to quit, and Space to simulate a beat.
```

On Linux the Rust program also opens an audio input device, if the system uses Pipewire.


## Building & Running on Windows

### Build

Open the folder with Visual Studio, it should automatically detect the CMake
configurations.

If you don't want to do this, there are some caveats to using CMake itself directly:

* Use `-DCMAKE_GENERATOR_PLATFORM=Win32` to get a 32-bit project. Nothing builds under
  64-bit with the MS compiler due to `__asm` blocks (yet).
* CMake doesn't rebuild the project very well if you don't clean out the generated files
  first. Visual Studio handles this for you.
* Using the CMake GUI is not recommended.

### Run With Winamp

If you properly installed Winamp2 with the installer the project import should pickup
the installation location for you and will copy the output `vis_avs.dll` into the
`Winamp/Plugins` directory for you. You can then:

* Start Winamp
* Debug > Attach to process (`Ctrl`+`Alt`+`P`), search for "winamp"
* Launch AVS by double-clicking the small oscilloscope/spectrum vis on the left of
  Winamp's main window


## Conventions

If going through the code reveals areas of possible improvements, mark them with a TODO
comment, possibly using a secondary flag to categorize the suggestion:

| tag | intent |
|-----|--------|
|`// TODO [cleanup]: <comment>`    |cleaner or more readable code is possible here   |
|`// TODO [bugfix]: <comment>`     |more stable or less buggy code is possible here  |
|`// TODO [performance]: <comment>`|the performance of AVS could be better here      |
|`// TODO [feature]: <comment>`    |a new capability of AVS could be implemented here|


## Notes

Thanks to _Warrior of the Light_ for assembling the source from various edits and patch
versions that floated around soon after the code publication.

Thanks to [Jan](https://github.com/idleberg) for maintaining [Visbot
](https://visbot.net) & invaluable feedback and brainstorming over the years.

Thanks to [Sebastian](https://github.com/hartwork) for many hours of eartime and code
minutiae discussions and the CI script.

Thanks to [Lukas](https://exo-cortex.github.io/) for some code help, but mostly ideas
and feedback.

## License

BSD-3, see [LICENSE.TXT](LICENSE.TXT).
