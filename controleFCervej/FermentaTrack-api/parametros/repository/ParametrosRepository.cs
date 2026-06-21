using ControleFCervej.RESTAPI.parametros.model;
using ControleFCervej.RESTAPI.shared.database;

namespace ControleFCervej.RESTAPI.parametros.repository;

public sealed class ParametrosRepository
{
    private readonly DatabaseConnectionFactory _connectionFactory;

    public ParametrosRepository(DatabaseConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public ParametrosAceitaveis? ObterPorCervejaId(Guid cervejaId)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, cerveja_id, temp_min, temp_max, ph_min, ph_max,
                   extrato_min, extrato_max, criado_em, atualizado_em
            FROM parametros_aceitaveis
            WHERE cerveja_id = @cerveja_id;
            """;
        command.Parameters.AddWithValue("cerveja_id", cervejaId);

        using var reader = command.ExecuteReader();

        return reader.Read() ? Mapear(reader) : null;
    }

    public ParametrosAceitaveis Salvar(
        Guid cervejaId,
        decimal tempMin,
        decimal tempMax,
        decimal phMin,
        decimal phMax,
        decimal extratoMin,
        decimal extratoMax
    )
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO parametros_aceitaveis (
                id, cerveja_id, temp_min, temp_max, ph_min, ph_max,
                extrato_min, extrato_max, criado_em, atualizado_em
            )
            VALUES (
                @id, @cerveja_id, @temp_min, @temp_max, @ph_min, @ph_max,
                @extrato_min, @extrato_max, @agora, @agora
            )
            ON CONFLICT (cerveja_id)
            DO UPDATE SET
                temp_min = EXCLUDED.temp_min,
                temp_max = EXCLUDED.temp_max,
                ph_min = EXCLUDED.ph_min,
                ph_max = EXCLUDED.ph_max,
                extrato_min = EXCLUDED.extrato_min,
                extrato_max = EXCLUDED.extrato_max,
                atualizado_em = EXCLUDED.atualizado_em
            RETURNING id, cerveja_id, temp_min, temp_max, ph_min, ph_max,
                      extrato_min, extrato_max, criado_em, atualizado_em;
            """;
        command.Parameters.AddWithValue("id", Guid.NewGuid());
        command.Parameters.AddWithValue("cerveja_id", cervejaId);
        command.Parameters.AddWithValue("temp_min", tempMin);
        command.Parameters.AddWithValue("temp_max", tempMax);
        command.Parameters.AddWithValue("ph_min", phMin);
        command.Parameters.AddWithValue("ph_max", phMax);
        command.Parameters.AddWithValue("extrato_min", extratoMin);
        command.Parameters.AddWithValue("extrato_max", extratoMax);
        command.Parameters.AddWithValue("agora", DateTime.UtcNow);

        using var reader = command.ExecuteReader();

        if (!reader.Read())
        {
            throw new InvalidOperationException("Nao foi possivel salvar os parametros aceitaveis.");
        }

        return Mapear(reader);
    }

    public bool RemoverPorCervejaId(Guid cervejaId)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM parametros_aceitaveis WHERE cerveja_id = @cerveja_id;";
        command.Parameters.AddWithValue("cerveja_id", cervejaId);

        return command.ExecuteNonQuery() > 0;
    }

    private static ParametrosAceitaveis Mapear(Npgsql.NpgsqlDataReader reader)
    {
        return new ParametrosAceitaveis(
            reader.GetGuid(reader.GetOrdinal("id")),
            reader.GetGuid(reader.GetOrdinal("cerveja_id")),
            reader.GetDecimal(reader.GetOrdinal("temp_min")),
            reader.GetDecimal(reader.GetOrdinal("temp_max")),
            reader.GetDecimal(reader.GetOrdinal("ph_min")),
            reader.GetDecimal(reader.GetOrdinal("ph_max")),
            reader.GetDecimal(reader.GetOrdinal("extrato_min")),
            reader.GetDecimal(reader.GetOrdinal("extrato_max")),
            reader.GetDateTime(reader.GetOrdinal("criado_em")),
            reader.GetDateTime(reader.GetOrdinal("atualizado_em"))
        );
    }
}
