# The MIT License (MIT)
# Copyright © 2021 Yuma Rao
# Copyright © 2024 Opentensor Technologies Inc.

# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the “Software”), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all copies or substantial portions of
# the Software.

# THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
# THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

from setuptools import setup, find_packages
from os import path
from io import open
import codecs
import re
import os
import pathlib


def read_requirements(path):
    requirements = []
    git_requirements = []

    with pathlib.Path(path).open() as requirements_txt:
        for line in requirements_txt:
            if line.startswith("git+"):
                pkg_name = re.search(r"egg=([a-zA-Z0-9_-]+)", line.strip()).group(1)
                requirements.append(pkg_name + " @ " + line.strip())
            else:
                requirements.append(line.strip())

    return requirements


requirements = read_requirements("requirements/prod.txt")
extra_requirements_dev = read_requirements("requirements/dev.txt")

here = path.abspath(path.dirname(__file__))

with open(path.join(here, "README.md"), encoding="utf-8") as f:
    long_description = f.read()


# loading version from setup.py
with codecs.open(
    os.path.join(here, "substrate_ledger_py/__init__.py"), encoding="utf-8"
) as init_file:
    version_match = re.search(
        r"^__version__ = ['\"]([^'\"]*)['\"]", init_file.read(), re.M
    )
    version_string = version_match.group(1)

setup(
    name="substrate_ledger_py",
    version=version_string,
    description="A client for the Substrate Generic Ledger App",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/opentensor/substrate-ledger-py",
    author="Opentensor Technologies Inc",
    packages=find_packages(exclude=["tests", "tests.*"]),
    include_package_data=True,
    author_email="",
    license="MIT",
    python_requires=">=3.9",
    install_requires=requirements,
    extras_require={
        "dev": extra_requirements_dev,
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Build Tools",
        # Pick your license as you wish
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Scientific/Engineering",
        "Topic :: Software Development",
        "Topic :: Software Development :: Libraries",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
)
