using CrmEarlyBound;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestAppointmentObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? ScheduledStart
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? ScheduledEnd
        {
            get;
            set;
        }

        [DataMember]
        public Guid RegardingObjectId
        {
            get;
            set;
        }

        [DataMember]
        public string Subject
        {
            get;
            set;
        }

        [DataMember]
        public string RelativeDay
        {
            get;
            set;
        }

        [DataMember]
        public Guid ContactId
        {
            get;
            set;
        }

        [DataMember]
        public string FirstName
        {
            get;
            set;
        }

        [DataMember]
        public string LastName
        {
            get;
            set;
        }

        [DataMember]
        public string MobilePhone
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_Line1
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_Line2
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_City
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_StateOrProvince
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_PostalCode
        {
            get;
            set;
        }

        [DataMember]
        public string ImageName
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? EnteredBuilding
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? LeftBuilding
        {
            get;
            set;
        }

        [DataMember]
        public DateTime? DistressCallReceived
        {
            get;
            set;
        }
    }

    public class AppointmentsController : ApiController
    {
        // GET api/appointment/[Guid.ToString()]
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://childsafety.crm.dynamics.com; Username=; Password=");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            WhoAmIRequest who = new WhoAmIRequest();
            var userId = ctx.Execute(who).Results["UserId"];

            var query = from a in ctx.AppointmentSet join i in ctx.IncidentSet on a.RegardingObjectId.Id equals i.Id join c in ctx.ContactSet on i.CustomerId.Id equals c.Id
                        where a.OwnerId.Id == new Guid(userId.ToString())
                        select new TestAppointmentObject
                        {
                            Id = a.Id,
                            ScheduledStart = a.ScheduledStart,
                            ScheduledEnd = a.ScheduledEnd,
                            RegardingObjectId = a.RegardingObjectId.Id,
                            Subject = a.Subject,
                            ContactId = i.CustomerId.Id,
                            FirstName = c.FirstName,
                            LastName = c.LastName,
                            MobilePhone = c.MobilePhone,
                            Address1_Line1 = c.Address1_Line1,
                            Address1_Line2 = c.Address1_Line2,
                            Address1_City = c.Address1_City,
                            Address1_StateOrProvince = c.Address1_StateOrProvince,
                            Address1_PostalCode = c.Address1_PostalCode,
                            ImageName = c.new_SienaImageName,
                            EnteredBuilding = a.new_EnteredBuilding,
                            LeftBuilding = a.new_LeftBuilding,
                            DistressCallReceived = a.new_DistressCallReceived
                        };

            var queryResults = query.ToList();

            foreach (TestAppointmentObject x in queryResults)
            {
                var today = DateTime.Today;
                if (((DateTime)x.ScheduledStart).Date == today.Date)
                {
                    x.RelativeDay = "Today";
                }
                else if (((DateTime)x.ScheduledStart).Date == today.Add(new System.TimeSpan(1, 0, 0, 0)).Date)
                {
                    x.RelativeDay = "Tomorrow";
                }
                else if (((DateTime)x.ScheduledStart).Date == today.Add(new System.TimeSpan(2, 0, 0, 0)).Date)
                {
                    x.RelativeDay = "2 Days";
                }
                else if (((DateTime)x.ScheduledStart).Date < today.Date)
                {
                    x.RelativeDay = "Previous";
                }
                else
                {
                    x.RelativeDay = "Later";
                }
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                queryResults);
        }

        public HttpResponseMessage Post(Guid appointmentId, string operationName, string operationTime)
        {
            CrmConnection connection = CrmConnection.Parse("Url=https://casemobile.crm.dynamics.com; Username=; Password=;");
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var appointment = new Appointment();
            appointment.Id = appointmentId;
            switch (operationName)
            {
                case "EnteredBuilding":
                    appointment.new_EnteredBuilding = Convert.ToDateTime(operationTime);
                    break;
                case "LeftBuilding":
                    appointment.new_LeftBuilding = Convert.ToDateTime(operationTime);
                    break;
                case "DistressCallReceived":
                    appointment.new_DistressCallReceived = Convert.ToDateTime(operationTime);
                    break;
            }

            try
            {
                ctx.Update(appointment);
            }
            catch (Exception e)
            {
                return this.Request.CreateResponse(
                    HttpStatusCode.InternalServerError, e);
            }

            return this.Request.CreateResponse(
                HttpStatusCode.Accepted);
        }
    }
}
