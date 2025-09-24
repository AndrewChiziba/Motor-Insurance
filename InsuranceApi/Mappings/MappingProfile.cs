using AutoMapper;
using InsuranceApi.DTOs;
using InsuranceApi.Models;

namespace InsuranceApi.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Vehicle, VehicleDto>().ReverseMap();
        CreateMap<CreateVehicleDto, Vehicle>();

        CreateMap<InsurancePolicy, InsurancePolicyDto>().ReverseMap();
        CreateMap<CreateInsurancePolicyDto, InsurancePolicy>();

        CreateMap<Quotation, InsuranceQuoteDto>().ReverseMap();
        CreateMap<CreateInsuranceQuoteDto, Quotation>();

        CreateMap<CreatePaymentDto, Payment>().ReverseMap();
        CreateMap<Payment, PaymentDto>();
    }
}