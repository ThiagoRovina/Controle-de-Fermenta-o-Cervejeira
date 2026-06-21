using System.Text;
using ControleFCervej.RESTAPI.registros.model;
using ControleFCervej.RESTAPI.shared.database;

namespace ControleFCervej.RESTAPI.registros.repository;

public sealed class RegistroRepository
{
    private readonly DatabaseConnectionFactory _connectionFactory;

    public RegistroRepository(DatabaseConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public IReadOnlyCollection<RegistroFermentativo> Listar(
        Guid? cervejaId = null,
        Guid? tanqueId = null,
        string? numeroLote = null,
        string? status = null
    )
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        var sql = new StringBuilder("""
            SELECT id, cerveja_id, tanque_id, numero_lote, data_hora,
                   temperatura, ph, extrato, observacoes, status, criado_em
            FROM registros_fermentativos
            """);
        var filtros = new List<string>();

        if (cervejaId is not null)
        {
            filtros.Add("cerveja_id = @cerveja_id");
            command.Parameters.AddWithValue("cerveja_id", cervejaId.Value);
        }

        if (tanqueId is not null)
        {
            filtros.Add("tanque_id = @tanque_id");
            command.Parameters.AddWithValue("tanque_id", tanqueId.Value);
        }

        if (!string.IsNullOrWhiteSpace(numeroLote))
        {
            filtros.Add("LOWER(numero_lote) = LOWER(@numero_lote)");
            command.Parameters.AddWithValue("numero_lote", numeroLote.Trim());
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            filtros.Add("LOWER(status) = LOWER(@status)");
            command.Parameters.AddWithValue("status", status.Trim());
        }

        if (filtros.Count > 0)
        {
            sql.Append(" WHERE ");
            sql.Append(string.Join(" AND ", filtros));
        }

        sql.Append(" ORDER BY data_hora DESC, criado_em DESC;");
        command.CommandText = sql.ToString();

        using var reader = command.ExecuteReader();
        var registros = new List<RegistroFermentativo>();

        while (reader.Read())
        {
            registros.Add(Mapear(reader));
        }

        return registros;
    }

    public RegistroFermentativo? ObterPorId(Guid id)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, cerveja_id, tanque_id, numero_lote, data_hora,
                   temperatura, ph, extrato, observacoes, status, criado_em
            FROM registros_fermentativos
            WHERE id = @id;
            """;
        command.Parameters.AddWithValue("id", id);

        using var reader = command.ExecuteReader();

        return reader.Read() ? Mapear(reader) : null;
    }

    public RegistroFermentativo Criar(
        Guid cervejaId,
        Guid tanqueId,
        string numeroLote,
        DateTime dataHora,
        decimal temperatura,
        decimal ph,
        decimal extrato,
        string? observacoes,
        string status
    )
    {
        var registro = new RegistroFermentativo(
            Guid.NewGuid(),
            cervejaId,
            tanqueId,
            numeroLote,
            dataHora.Kind == DateTimeKind.Utc ? dataHora : dataHora.ToUniversalTime(),
            temperatura,
            ph,
            extrato,
            observacoes,
            status,
            DateTime.UtcNow
        );

        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO registros_fermentativos (
                id, cerveja_id, tanque_id, numero_lote, data_hora,
                temperatura, ph, extrato, observacoes, status, criado_em
            )
            VALUES (
                @id, @cerveja_id, @tanque_id, @numero_lote, @data_hora,
                @temperatura, @ph, @extrato, @observacoes, @status, @criado_em
            );
            """;
        command.Parameters.AddWithValue("id", registro.Id);
        command.Parameters.AddWithValue("cerveja_id", registro.CervejaId);
        command.Parameters.AddWithValue("tanque_id", registro.TanqueId);
        command.Parameters.AddWithValue("numero_lote", registro.NumeroLote);
        command.Parameters.AddWithValue("data_hora", registro.DataHora);
        command.Parameters.AddWithValue("temperatura", registro.Temperatura);
        command.Parameters.AddWithValue("ph", registro.Ph);
        command.Parameters.AddWithValue("extrato", registro.Extrato);
        command.Parameters.AddWithValue("observacoes", (object?)registro.Observacoes ?? DBNull.Value);
        command.Parameters.AddWithValue("status", registro.Status);
        command.Parameters.AddWithValue("criado_em", registro.CriadoEm);
        command.ExecuteNonQuery();

        return registro;
    }

    public RegistroFermentativo? Atualizar(
        Guid id,
        Guid cervejaId,
        Guid tanqueId,
        string numeroLote,
        DateTime dataHora,
        decimal temperatura,
        decimal ph,
        decimal extrato,
        string? observacoes,
        string status
    )
    {
        var dataHoraUtc = dataHora.Kind == DateTimeKind.Utc ? dataHora : dataHora.ToUniversalTime();

        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE registros_fermentativos
            SET cerveja_id = @cerveja_id,
                tanque_id = @tanque_id,
                numero_lote = @numero_lote,
                data_hora = @data_hora,
                temperatura = @temperatura,
                ph = @ph,
                extrato = @extrato,
                observacoes = @observacoes,
                status = @status
            WHERE id = @id;
            """;
        command.Parameters.AddWithValue("id", id);
        command.Parameters.AddWithValue("cerveja_id", cervejaId);
        command.Parameters.AddWithValue("tanque_id", tanqueId);
        command.Parameters.AddWithValue("numero_lote", numeroLote);
        command.Parameters.AddWithValue("data_hora", dataHoraUtc);
        command.Parameters.AddWithValue("temperatura", temperatura);
        command.Parameters.AddWithValue("ph", ph);
        command.Parameters.AddWithValue("extrato", extrato);
        command.Parameters.AddWithValue("observacoes", (object?)observacoes ?? DBNull.Value);
        command.Parameters.AddWithValue("status", status);

        return command.ExecuteNonQuery() > 0 ? ObterPorId(id) : null;
    }

    public bool Remover(Guid id)
    {
        using var connection = _connectionFactory.CreateConnection();
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM registros_fermentativos WHERE id = @id;";
        command.Parameters.AddWithValue("id", id);

        return command.ExecuteNonQuery() > 0;
    }

    private static RegistroFermentativo Mapear(Npgsql.NpgsqlDataReader reader)
    {
        var observacoesOrdinal = reader.GetOrdinal("observacoes");

        return new RegistroFermentativo(
            reader.GetGuid(reader.GetOrdinal("id")),
            reader.GetGuid(reader.GetOrdinal("cerveja_id")),
            reader.GetGuid(reader.GetOrdinal("tanque_id")),
            reader.GetString(reader.GetOrdinal("numero_lote")),
            reader.GetDateTime(reader.GetOrdinal("data_hora")),
            reader.GetDecimal(reader.GetOrdinal("temperatura")),
            reader.GetDecimal(reader.GetOrdinal("ph")),
            reader.GetDecimal(reader.GetOrdinal("extrato")),
            reader.IsDBNull(observacoesOrdinal) ? null : reader.GetString(observacoesOrdinal),
            reader.GetString(reader.GetOrdinal("status")),
            reader.GetDateTime(reader.GetOrdinal("criado_em"))
        );
    }
}
