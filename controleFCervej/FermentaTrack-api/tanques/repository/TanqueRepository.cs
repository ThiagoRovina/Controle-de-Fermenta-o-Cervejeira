using ControleFCervej.RESTAPI.shared.database;
using ControleFCervej.RESTAPI.tanques.model;

namespace ControleFCervej.RESTAPI.tanques.repository;

public sealed class TanqueRepository
{
    private readonly DatabaseConnectionFactory _connectionFactory;

    public TanqueRepository(DatabaseConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public IReadOnlyCollection<Tanque> Listar()
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, nome, capacidade_l, criado_em
            FROM tanques
            ORDER BY nome;
            """;

        using var reader = command.ExecuteReader();
        var tanques = new List<Tanque>();

        while (reader.Read())
        {
            tanques.Add(Mapear(reader));
        }

        return tanques;
    }

    public Tanque? ObterPorId(Guid id)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, nome, capacidade_l, criado_em
            FROM tanques
            WHERE id = @id;
            """;
        command.Parameters.AddWithValue("id", id);

        using var reader = command.ExecuteReader();

        return reader.Read() ? Mapear(reader) : null;
    }

    public Tanque Criar(string nome, decimal capacidade)
    {
        var tanque = new Tanque(Guid.NewGuid(), nome, capacidade, DateTime.UtcNow);

        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO tanques (id, nome, capacidade_l, criado_em)
            VALUES (@id, @nome, @capacidade_l, @criado_em);
            """;
        command.Parameters.AddWithValue("id", tanque.Id);
        command.Parameters.AddWithValue("nome", tanque.Nome);
        command.Parameters.AddWithValue("capacidade_l", tanque.Capacidade);
        command.Parameters.AddWithValue("criado_em", tanque.CriadoEm);
        command.ExecuteNonQuery();

        return tanque;
    }

    public Tanque? Atualizar(Guid id, string nome, decimal capacidade)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE tanques
            SET nome = @nome,
                capacidade_l = @capacidade_l
            WHERE id = @id
            RETURNING id, nome, capacidade_l, criado_em;
            """;
        command.Parameters.AddWithValue("id", id);
        command.Parameters.AddWithValue("nome", nome);
        command.Parameters.AddWithValue("capacidade_l", capacidade);

        using var reader = command.ExecuteReader();

        return reader.Read() ? Mapear(reader) : null;
    }

    public bool Remover(Guid id)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM tanques WHERE id = @id;";
        command.Parameters.AddWithValue("id", id);

        return command.ExecuteNonQuery() > 0;
    }

    private static Tanque Mapear(Npgsql.NpgsqlDataReader reader)
    {
        return new Tanque(
            reader.GetGuid(reader.GetOrdinal("id")),
            reader.GetString(reader.GetOrdinal("nome")),
            reader.GetDecimal(reader.GetOrdinal("capacidade_l")),
            reader.GetDateTime(reader.GetOrdinal("criado_em"))
        );
    }
}
