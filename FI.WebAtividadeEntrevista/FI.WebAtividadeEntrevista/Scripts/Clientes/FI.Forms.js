var key = 0;
var dictBeneficiarios = [];

$(document).ready(function () {
    var TelefoneMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
        spOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(TelefoneMaskBehavior.apply({}, arguments), options);
            }
        };

    $('#formCadastro #Telefone').mask(TelefoneMaskBehavior, spOptions);
    $('#formCadastro #CPF').mask('000.000.000-00');
    $('#formCadastro #CEP').mask('00000-000');

    $('#CPFBeneficiario').mask('000.000.000-00');

    $("#btBeneficiarios").click(function () {
        $('#ModalBeneficiarios').modal({ backdrop: 'static', show: true });
    });

    $('#ModalBeneficiarios').on('hidden.bs.modal', function (e) {
        LimparCamposBeneficiario();
    })

    $("#SubmitBeneficiario").click(function () {
        $("#alertBeneficiario").remove();

        if ($("#NomeBeneficiario").val() == "" || $("#CPFBeneficiario").val() == "")
            return false;

        if (!ValidarCPF($("#CPFBeneficiario").val())) {
            var alertCPF = '<div id="alertBeneficiario" name="alertBeneficiario" class="alert alert-warning alert-dismissible" role="alert">'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                '<strong>Aviso!</strong> O CPF informado é inválido'+
            '</div>';

            $("#ModalBeneficiarios .modal-body").prepend(alertCPF)

            return false;
        }

        if ($("#keyBeneficiario").val() != "")
            key = $("#keyBeneficiario").val();
        else {
            for (const [key, value] of Object.entries(dictBeneficiarios)) {
                if (value.CPF == $("#CPFBeneficiario").val()) {
                    var alertCPF = '<div id="alertBeneficiario" name="alertBeneficiario" class="alert alert-warning alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '<strong>Aviso!</strong> O CPF informado já esta na lista de benifíciarios' +
                        '</div>';

                    $("#ModalBeneficiarios .modal-body").prepend(alertCPF)

                    return false;
                }
            };
            key++;
        }
            

        dictBeneficiarios[key] = { Nome: $("#NomeBeneficiario").val(), CPF: $("#CPFBeneficiario").val() };
        AtualizarGrid();
        LimparCamposBeneficiario();
    });
});

function LimparCamposBeneficiario() {
    $("#alertBeneficiario").remove();
    $("#formBeneficiarios")[0].reset();
    $("#keyBeneficiario").val('');
    $("#SubmitBeneficiario").text("Incluir");
}

function ValidarCPF(cpf) {
    cpf = cpf.toString().replaceAll('.', '').replaceAll('-', '');
    var Soma;
    var Resto;
    Soma = 0;
    if (cpf.length != 11 || cpf == "00000000000" ||
        cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" ||
        cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" ||
        cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
        return false;

    for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;

    if (Resto != parseInt(cpf.substring(9, 10)))
        return false;

    Soma = 0;
    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;

    if (Resto != parseInt(cpf.substring(10, 11)))
        return false;

    return true;
}

function MontaBeneficiarios() {
    var beneficiarios = [];
    for (const [key, value] of Object.entries(dictBeneficiarios)) {
        beneficiarios.push(value);
    };
    return beneficiarios;
}

function MontaDictBeneficiarios(beneficiarios) {
    beneficiarios.forEach(function (beneficiario, index) {
        dictBeneficiarios[index] = { Nome: beneficiario.Nome, CPF: beneficiario.CPF };
    });
    AtualizarGrid();
}

function ExcluirBeneficiario(key) {
    delete dictBeneficiarios[key];
    AtualizarGrid();
}

function AlterarBeneficiario(key) {
    $("#keyBeneficiario").val(key);
    $("#CPFBeneficiario").val(dictBeneficiarios[key].CPF);
    $("#NomeBeneficiario").val(dictBeneficiarios[key].Nome);
    $("#SubmitBeneficiario").text("Atualizar");
}

function AtualizarGrid() {
    $("#gridBeneficiarios tbody").empty();

    for (const [key, value] of Object.entries(dictBeneficiarios)) {
        var tr = '<tr id="trBeneficiario-' + key + '">                                                                                                                 ' +
            '  <td>' + value.CPF + '</td>                                                                                               ' +
            '  <td>' + value.Nome + '</td>                                                                                              ' +
            '  <td>                                                                                                                     ' +
            '      <button type="button" onclick="AlterarBeneficiario(' + key + ');" class="btn btn-sm btn-primary">Alterar</button>    ' +
            '      <button type="button" onclick="ExcluirBeneficiario(' + key + ');" class="btn btn-sm btn-primary">Excluir</button>    ' +
            '  </td>                                                                                                                    ' +
            '</tr>                                                                                                                      ';

        $("#gridBeneficiarios tbody").append(tr);
    };
}