using ControleFCervej.RESTAPI.cervejas.model;
using ControleFCervej.RESTAPI.shared.database;

namespace ControleFCervej.RESTAPI.cervejas.repository;

public sealed class CervejaRepository
{
    private readonly DatabaseConnectionFactory _connectionFactory;

    public CervejaRepository(DatabaseConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public IReadOnlyCollection<Cerveja> Listar()
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, nome, estilo, criado_em
            FROM cervejas
            ORDER BY nome, estilo;
            """;

        using var reader = command.ExecuteReader();
        var cervejas = new List<Cerveja>();

        while (reader.Read())
        {
            cervejas.Add(Mapear(reader));
        }

        return cervejas;
    }

    public Cerveja? ObterPorId(Guid id)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, nome, estilo, criado_em
            FROM cervejas
            WHERE id = @id;
            """;
        command.Parameters.AddWithValue("id", id);

        using var reader = command.ExecuteReader();

        return reader.Read() ? Mapear(reader) : null;
    }

    public Cerveja Criar(string nome, string estilo)
    {
        var cerveja = new Cerveja(Guid.NewGuid(), nome, estilo, DateTime.UtcNow);

        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO cervejas (id, nome, estilo, criado_em)
            VALUES (@id, @nome, @estilo, @criado_em);
            """;
        command.Parameters.AddWithValue("id", cerveja.Id);
        command.Parameters.AddWithValue("nome", cerveja.Nome);
        command.Parameters.AddWithValue("estilo", cerveja.Estilo);
        command.Parameters.AddWithValue("criado_em", cerveja.CriadoEm);
        command.ExecuteNonQuery();

        return cerveja;
    }

    public Cerveja? Atualizar(Guid id, string nome, string estilo)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE cervejas
            SET nome = @nome,
                estilo = @estilo
            WHERE id = @id
            RETURNING id, nome, estilo, criado_em;
            """;
        command.Parameters.AddWithValue("id", id);
        command.Parameters.AddWithValue("nome", nome);
        command.Parameters.AddWithValue("estilo", estilo);

        using var reader = command.ExecuteReader();

        return reader.Read() ? Mapear(reader) : null;
    }

    public bool Remover(Guid id)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM cervejas WHERE id = @id;";
        command.Parameters.AddWithValue("id", id);

        return command.ExecuteNonQuery() > 0;
    }

    private static Cerveja Mapear(Npgsql.NpgsqlDataReader reader)
    {
        return new Cerveja(
            reader.GetGuid(reader.GetOrdinal("id")),
            reader.GetString(reader.GetOrdinal("nome")),
            reader.GetString(reader.GetOrdinal("estilo")),
            reader.GetDateTime(reader.GetOrdinal("criado_em"))
        );
    }
}
