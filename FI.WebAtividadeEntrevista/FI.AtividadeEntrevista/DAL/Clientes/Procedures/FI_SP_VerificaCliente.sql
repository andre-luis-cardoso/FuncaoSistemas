CREATE PROC FI_SP_VerificaCliente
	@ID BIGINT,
	@CPF VARCHAR(14)
AS
BEGIN
	IF(ISNULL(@ID,0) = 0)
		SELECT 1 FROM CLIENTES WHERE CPF = @CPF
	ELSE
		SELECT 1 FROM CLIENTES WHERE CPF = @CPF and ID <> @ID
END