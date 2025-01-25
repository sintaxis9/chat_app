{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.postgresql
  ];

  shellHook = ''
    echo "starting postgreSQL..."

    export PGDATA=$PWD/.pgdata

    if [ ! -d "$PGDATA" ]; then
      echo "PostgreSQL in $PGDATA"
      initdb -D $PGDATA
    fi

    pg_ctl -D $PGDATA -o "-p 5432" -l $PWD/postgresql.log start
    echo "PostgreSQL in PORT 543"

    trap 'pg_ctl -D $PGDATA stop' EXIT
  '';
}
